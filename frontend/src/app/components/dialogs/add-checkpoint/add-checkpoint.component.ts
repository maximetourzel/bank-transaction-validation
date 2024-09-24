import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Period } from '../../../models/period';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

export interface AddMovementDialogData {
  period: Period;
}

@Component({
  selector: 'app-add-checkpoint',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-checkpoint.component.html',
  styleUrl: './add-checkpoint.component.scss',
})
export class AddCheckpointComponent {
  readonly dialogRef = inject(MatDialogRef<AddCheckpointComponent>);
  readonly data = inject<AddMovementDialogData>(MAT_DIALOG_DATA);
  newCheckpointForm = new FormGroup({
    date: new FormControl('', Validators.required),
    balance: new FormControl(0, Validators.required),
  });

  onSubmit(): void {
    if (this.newCheckpointForm.valid) {
      const newCheckpoint = {
        date: new Date(this.newCheckpointForm.value.date!)
          .toISOString()
          .split('T')[0],
        balance: this.newCheckpointForm.value.balance,
      };
      this.dialogRef.close(newCheckpoint);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
