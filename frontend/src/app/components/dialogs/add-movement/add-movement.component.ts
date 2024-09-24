import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Period } from '../../../models/period';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateBankMovementDto } from '../../../models/dto/create-bank-movement-dto';

export interface AddMovementDialogData {
  period: Period;
}

@Component({
  selector: 'app-add-movement',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-movement.component.html',
  styleUrl: './add-movement.component.scss',
})
export class AddMovementComponent {
  readonly dialogRef = inject(MatDialogRef<AddMovementComponent>);

  readonly data = inject<AddMovementDialogData>(MAT_DIALOG_DATA);
  newMovementForm = new FormGroup({
    wording: new FormControl('', Validators.required),
    amount: new FormControl(0, Validators.required),
    date: new FormControl('', Validators.required),
  });

  onSubmit(): void {
    if (this.newMovementForm.valid) {
      const createBankMovement: CreateBankMovementDto = {
        wording: this.newMovementForm.value.wording!,
        amount: this.newMovementForm.value.amount!,
        date: new Date(this.newMovementForm.value.date!)
          .toISOString()
          .split('T')[0],
      };
      this.dialogRef.close(createBankMovement);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
