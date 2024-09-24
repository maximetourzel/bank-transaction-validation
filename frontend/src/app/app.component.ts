import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  effect,
  Signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PeriodService } from './services/periods/period.service';
import { Period } from './models/period';
import { MatTableModule } from '@angular/material/table';
import { Movement } from './models/movement';
import { BankMovementService } from './services/movements/bank-movement.service';
import { Checkpoint } from './models/checkpoint';
import { BalanceCheckpointService } from './services/checkpoint/balance-checkpoint.service';
import { MatButtonModule } from '@angular/material/button';
import { ValidationService } from './services/validation/validation.service';
import { Validation } from './models/validation';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddMovementComponent } from './components/dialogs/add-movement/add-movement.component';
import { CreateBankMovementDto } from './models/dto/create-bank-movement-dto';
import {
  isPotentialMovementDuplicateError,
  isUnexpectedAmountError,
} from './models/validation-error';
import { MatTooltipModule } from '@angular/material/tooltip';
import { mergeMap, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CreateBalanceCheckpointDto } from './models/dto/create-balance-checkpoint-dto';
import { AddCheckpointComponent } from './components/dialogs/add-checkpoint/add-checkpoint.component';
import { AddPeriodComponent } from './components/dialogs/add-period/add-period.component';
import { CreatePeriodDto } from './models/dto/create-period-dto';
import { ValidationErrorType } from './enums/validation-error-type.enum';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';

interface MovementTableData extends Movement {
  duplicateErrorTooltip?: string;
  amountErrorTooltip?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  periods = signal<Period[]>([]);
  selectedPeriod = signal<Period | null>(null);

  movementsAreLoading = false;
  movements = signal<Movement[]>([]);
  movementTableDatas: Signal<MovementTableData[]> = computed(() => {
    const validationErrors = this.validation()?.validationErrors || [];

    const potentialDuplicateMovementIds: string[] = validationErrors
      .filter(isPotentialMovementDuplicateError)
      .flatMap((error) => error.movementIds);

    const unexpectedAmountMovementIds: string[] = validationErrors
      .filter(isUnexpectedAmountError)
      .map((error) => error.movementId);

    return this.movements().map((movement) => {
      const hasPotentialDuplicate = potentialDuplicateMovementIds.includes(
        movement.id,
      );

      const hasUnexpectedAmount = unexpectedAmountMovementIds.includes(
        movement.id,
      );

      return {
        ...movement,
        duplicateErrorTooltip: hasPotentialDuplicate
          ? 'Potential duplicate'
          : undefined,
        amountErrorTooltip: hasUnexpectedAmount
          ? 'Unexpected amount'
          : undefined,
      };
    });
  });

  checkpointsAreLoading = false;
  checkpoints = signal<Checkpoint[]>([]);
  validation = signal<Validation | null>(null);

  movDisplayedColumns: string[] = ['date', 'wording', 'amount', 'delete'];
  cpDisplayedColumns: string[] = ['date', 'balance', 'delete'];

  hasMissingMovementsError = computed(() => {
    return this.validation()?.validationErrors.some(
      (error) => error.type === ValidationErrorType.MISSING_MOVEMENTS,
    );
  });

  hasMissingCheckpointsError = computed(() => {
    return this.validation()?.validationErrors.some(
      (error) => error.type === ValidationErrorType.MISSING_CHECKPOINT,
    );
  });

  movementsTotalAmount = computed(() => {
    return this.movements().reduce((acc, movement) => acc + movement.amount, 0);
  });

  hasBalanceMismatchError = computed(() => {
    return this.validation()?.validationErrors.some(
      (error) => error.type === ValidationErrorType.BALANCE_MISMATCH,
    );
  });

  expectedBalance = computed(() => {
    return this.checkpoints().reduce(
      (acc, checkpoint) => acc + checkpoint.balance,
      0,
    );
  });

  readonly dialog = inject(MatDialog);

  constructor(
    private periodService: PeriodService,
    private movementService: BankMovementService,
    private checkpointService: BalanceCheckpointService,
    private validationService: ValidationService,
  ) {
    effect(() => {
      if (this.selectedPeriod() !== null) {
        this.loadPeriods();
        this.loadMovements();
        this.loadCheckpoints();
        this.loadValidation();
      }
    });
  }

  ngOnInit(): void {
    this.loadPeriods();
  }

  loadPeriods(): void {
    this.periodService.getAllPeriods().subscribe((periods) => {
      this.periods.set(periods);
    });
  }

  loadMovements(): void {
    this.movementsAreLoading = true;
    this.movementService
      .getMovementsForPeriod(this.selectedPeriod()!.id)
      .subscribe((movements) => {
        this.movements.set(movements);
        this.movementsAreLoading = false;
      });
  }

  loadCheckpoints(): void {
    this.checkpointsAreLoading = true;
    this.checkpointService
      .getCheckpointsForPeriod(this.selectedPeriod()!.id)
      .subscribe((checkpoints) => {
        this.checkpoints.set(checkpoints);
        this.checkpointsAreLoading = false;
      });
  }

  loadValidation(): void {
    this.validationService
      .getValidationForPeriod(this.selectedPeriod()!.id)
      .pipe(
        mergeMap((validations) => {
          const currentValidation = validations.find((v) => !v.isHistorical);
          if (!currentValidation) {
            return this.validationService.createValidation(
              this.selectedPeriod()!.id,
            );
          }
          return of(currentValidation);
        }),
      )
      .subscribe((validation) => {
        this.validation.set(validation);
        // if (!validation.isValid) {
        //   this.handleValidationErrors(validation.validationErrors);
        // }
      });
  }

  onSelectPeriod(period: Period): void {
    this.selectedPeriod.set(period);
  }

  onValidate(): void {
    if (!this.selectedPeriod()?.id) {
      return;
    }
    this.validationService
      .createValidation(this.selectedPeriod()!.id)
      .subscribe((validation) => {
        this.validation.set(validation);

        if (!validation.isValid) {
          // this.handleValidationErrors(validation.validationErrors);
        }
      });
  }

  onAddPeriod(): void {
    const addPeriodDialogRef = this.dialog.open(AddPeriodComponent, {});

    addPeriodDialogRef.afterClosed().subscribe((result: CreatePeriodDto) => {
      if (result !== undefined) {
        this.addPeriod(result);
      }
    });
  }

  onAddMovement(): void {
    const addMovDialogRef = this.dialog.open(AddMovementComponent, {
      data: { period: this.selectedPeriod() },
    });

    addMovDialogRef.afterClosed().subscribe((result: CreateBankMovementDto) => {
      if (result !== undefined) {
        this.addMovement(result);
      }
    });
  }

  onAddCheckpoint(): void {
    const addCheckpointDialogRef = this.dialog.open(AddCheckpointComponent, {
      data: { period: this.selectedPeriod() },
    });

    addCheckpointDialogRef
      .afterClosed()
      .subscribe((result: CreateBalanceCheckpointDto) => {
        if (result !== undefined) {
          this.addCheckpoint(result);
        }
      });
  }

  onDeleteMovement(movementId: string): void {
    this.movementService.deleteMovement(movementId).subscribe({
      next: () => {
        // on supprime le mouvement de la liste des mouvements
        this.movements.update((movements) => {
          return movements.filter((m) => m.id !== movementId);
        });
        this.createValidation();
      },
      error: (error) => {
        console.error('Error deleting movement:', error);
      },
    });
  }

  addMovement(createBankMovementDto: CreateBankMovementDto) {
    this.movementService
      .createMovement(this.selectedPeriod()!.id, createBankMovementDto)
      .subscribe({
        next: (createdMovement) => {
          this.movements.update((movements) => [...movements, createdMovement]);
          this.createValidation();
        },
        error: (error) => {
          console.error('Error creating movement:', error);
        },
      });
  }

  onDeleteCheckpoint(checkpointId: string): void {
    this.checkpointService.deleteCheckpoint(checkpointId).subscribe({
      next: () => {
        // on supprime le checkpoint de la liste des checkpoints
        this.checkpoints.update((checkpoints) => {
          return checkpoints.filter((c) => c.id !== checkpointId);
        });
        this.createValidation();
      },
      error: (error) => {
        console.error('Error deleting checkpoint:', error);
      },
    });
  }

  addCheckpoint(createBalanceCheckpointDto: CreateBalanceCheckpointDto): void {
    this.checkpointService
      .createCheckpoint(this.selectedPeriod()!.id, createBalanceCheckpointDto)
      .subscribe({
        next: (createdCheckpoint) => {
          this.checkpoints.update((checkpoints) => [
            ...checkpoints,
            createdCheckpoint,
          ]);
          this.createValidation();
        },
        error: (error) => {
          console.error('Error creating checkpoint:', error);
        },
      });
  }

  addPeriod(createPeriodDto: CreatePeriodDto): void {
    this.periodService.createPeriod(createPeriodDto).subscribe({
      next: (createdPeriod) => {
        // this.periods.update((periods) => [...periods, createdPeriod]);
        this.selectedPeriod.set(createdPeriod);
      },
      error: (error) => {
        console.error('Error creating period:', error);
      },
    });
  }

  createValidation(): void {
    this.validationService
      .createValidation(this.selectedPeriod()!.id)
      .subscribe({
        next: (validation) => {
          this.validation.set(validation);
        },
        error: (error) => {
          console.error('Error creating validation:', error);
        },
      });
  }
}
