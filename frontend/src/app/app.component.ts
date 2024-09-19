import { Component, inject, OnInit } from '@angular/core';
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
  ValidationError,
} from './models/validation-error';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CreateBalanceCheckpointDto } from './models/dto/create-balance-checkpoint-dto';
import { AddCheckpointComponent } from './components/dialogs/add-checkpoint/add-checkpoint.component';
import { AddPeriodComponent } from './components/dialogs/add-period/add-period.component';
import { CreatePeriodDto } from './models/dto/create-period-dto';
import { ValidationErrorType } from './enums/validation-error-type.enum';

interface MovementTableData extends Movement {
  duplicateErrorTooltip?: string;
  amountErrorTooltip?: string;
  hasErrors: boolean;
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
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  selectedPeriod: Period | null = null;
  periods: Period[] = [];

  movementTableDatas: MovementTableData[] = [];
  movements: Movement[] = [];
  movDisplayedColumns: string[] = ['date', 'wording', 'amount', 'delete'];
  checkpoints: Checkpoint[] = [];
  cpDisplayedColumns: string[] = ['date', 'balance', 'delete'];
  validation: Validation | null = null;

  readonly dialog = inject(MatDialog);

  constructor(
    private periodService: PeriodService,
    private movementService: BankMovementService,
    private checkpointService: BalanceCheckpointService,
    private validationService: ValidationService,
  ) {}

  ngOnInit(): void {
    this.loadPeriods();
  }

  loadPeriods(): void {
    this.periodService.getAllPeriods().subscribe((periods) => {
      this.periods = periods;
    });
  }

  loadMovements(): Observable<Movement[] | null> {
    if (!this.selectedPeriod?.id) {
      return of(null); // Retourne un observable vide si `selectedPeriod` est invalide
    }
    return this.movementService
      .getMovementsForPeriod(this.selectedPeriod.id)
      .pipe(
        tap((movements) => {
          this.movements = movements;
          this.movementTableDatas = movements.map((m) => ({
            ...m,
            hasErrors: false,
          }));
        }),
      );
  }

  loadCheckpoints(): Observable<Checkpoint[] | null> {
    if (!this.selectedPeriod?.id) {
      return of(null); // Retourne un observable vide si `selectedPeriod` est invalide
    }
    return this.checkpointService
      .getCheckpointsForPeriod(this.selectedPeriod.id)
      .pipe(
        tap((checkpoints) => {
          this.checkpoints = checkpoints;
        }),
      );
  }

  loadValidation(): void {
    if (!this.selectedPeriod?.id) {
      return;
    }
    this.validationService
      .getValidationForPeriod(this.selectedPeriod.id)
      .pipe(
        mergeMap((validations) => {
          const currentValidation = validations.find((v) => !v.isHistorical);
          if (!currentValidation) {
            return this.validationService.createValidation(
              this.selectedPeriod!.id,
            );
          }
          return of(currentValidation);
        }),
      )
      .subscribe((validation) => {
        this.validation = validation;
        if (!validation.isValid) {
          this.handleValidationErrors(validation.validationErrors);
        }
      });
  }

  onSelectPeriod(): void {
    if (!this.selectedPeriod?.id) {
      return;
    }

    forkJoin({
      movements: this.loadMovements(),
      checkpoints: this.loadCheckpoints(),
    }).subscribe({
      next: () => {
        // Une fois que les deux appels sont terminés, on appelle loadValidation()
        this.loadValidation();
      },
      error: (error) => {
        console.error('Error loading movements or checkpoints:', error);
      },
    });
  }

  onValidate(): void {
    if (!this.selectedPeriod?.id) {
      return;
    }
    this.validationService
      .createValidation(this.selectedPeriod.id)
      .subscribe((validation) => {
        this.validation = validation;

        if (!validation.isValid) {
          this.handleValidationErrors(validation.validationErrors);
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
      data: { period: this.selectedPeriod },
    });

    addMovDialogRef.afterClosed().subscribe((result: CreateBankMovementDto) => {
      if (result !== undefined) {
        this.addMovement(result);
      }
    });
  }

  onAddCheckpoint(): void {
    const addCheckpointDialogRef = this.dialog.open(AddCheckpointComponent, {
      data: { period: this.selectedPeriod },
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
        // Une fois le mouvement supprimé, recharge les mouvements
        this.loadMovements().subscribe();
      },
      error: (error) => {
        console.error('Error deleting movement:', error);
      },
    });
  }

  addMovement(createBankMovementDto: CreateBankMovementDto) {
    if (!this.selectedPeriod?.id) {
      return;
    }

    this.movementService
      .createMovement(this.selectedPeriod.id, createBankMovementDto)
      .pipe(
        switchMap((createdMovement) => {
          return this.validationService.createValidation(
            this.selectedPeriod!.id,
          );
        }),
        switchMap(() => this.loadMovements()),
      )
      .subscribe({
        error: (error) => {
          console.error('Error creating movement:', error);
        },
      });
  }

  onDeleteCheckpoint(checkpointId: string): void {
    this.checkpointService.deleteCheckpoint(checkpointId).subscribe({
      next: () => {
        this.loadCheckpoints();
      },
      error: (error) => {
        console.error('Error deleting checkpoint:', error);
      },
    });
  }

  addCheckpoint(createBalanceCheckpointDto: CreateBalanceCheckpointDto): void {
    this.checkpointService
      .createCheckpoint(this.selectedPeriod!.id, createBalanceCheckpointDto)
      .subscribe({
        next: () => {
          this.loadCheckpoints();
        },
        error: (error) => {
          console.error('Error creating checkpoint:', error);
        },
      });
  }

  addPeriod(createPeriodDto: CreatePeriodDto): void {
    this.periodService.createPeriod(createPeriodDto).subscribe({
      next: (createdPeriod) => {
        this.periods.push(createdPeriod);
        this.selectedPeriod = createdPeriod;
      },
      error: (error) => {
        console.error('Error creating period:', error);
      },
    });
  }

  handleValidationErrors(validationErrors: ValidationError[]): void {
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        if (isPotentialMovementDuplicateError(error)) {
          const movementIds = error.movementIds;
          const duplicateErrorTooltip = `Potential duplicate movement`;
          this.movementTableDatas = this.movementTableDatas.map((m) => {
            if (movementIds.includes(m.id)) {
              return { ...m, duplicateErrorTooltip };
            }
            return m;
          });
        }
        if (isUnexpectedAmountError(error)) {
          const movementId = error.movementId;
          const amountErrorTooltip = `Unexpected amount for movement`;
          this.movementTableDatas = this.movementTableDatas.map((m) => {
            if (m.id === movementId) {
              return { ...m, amountErrorTooltip };
            }
            return m;
          });
        }
      });
    }
  }

  hasMissingMovementsError(): boolean {
    return this.validation!.validationErrors.some(
      (error) => error.type === ValidationErrorType.MISSING_MOVEMENTS,
    );
  }
  hasMissingCheckpointsError(): boolean {
    return this.validation!.validationErrors.some(
      (error) => error.type === ValidationErrorType.MISSING_CHECKPOINT,
    );
  }

  createValidation(): void {
    this.validationService.createValidation(this.selectedPeriod!.id).subscribe({
      next: (validation) => {
        this.validation = validation;
      },
      error: (error) => {
        console.error('Error creating validation:', error);
      },
    });
  }
}
