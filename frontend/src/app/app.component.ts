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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  periods: Period[] = [];
  selectedPeriodId: string | null = null;
  movements: Movement[] = [];
  movDisplayedColumns: string[] = ['date', 'wording', 'amount', 'delete'];
  checkpoints: Checkpoint[] = [];
  cpDisplayedColumns: string[] = ['date', 'balance'];
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

  loadMovements(): void {
    if (!this.selectedPeriodId) {
      return;
    }
    this.movementService
      .getMovementsForPeriod(this.selectedPeriodId)
      .subscribe((movements) => {
        this.movements = movements;
      });
  }

  loadCheckpoints(): void {
    if (!this.selectedPeriodId) {
      return;
    }
    this.checkpointService
      .getCheckpointsForPeriod(this.selectedPeriodId)
      .subscribe((checkpoints) => {
        this.checkpoints = checkpoints;
      });
  }

  onSelectPeriod(): void {
    this.loadMovements();

    this.loadCheckpoints();
  }

  onValidate(): void {
    if (!this.selectedPeriodId) {
      return;
    }
    this.validationService
      .createValidation(this.selectedPeriodId)
      .subscribe((validation) => {
        this.validation = validation;
      });
  }

  onAddMovement(): void {
    const addMovDialogRef = this.dialog.open(AddMovementComponent, {});

    addMovDialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
      }
    });
  }

  onDeleteMovement(movementId: string): void {
    this.movementService.deleteMovement(movementId).subscribe(() => {
      this.loadMovements();
    });
  }
}
