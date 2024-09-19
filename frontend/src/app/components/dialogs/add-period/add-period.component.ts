import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PeriodMonth } from '../../../enums/period-month.enum';
import { CreatePeriodDto } from '../../../models/dto/create-period-dto';

@Component({
  selector: 'app-add-period',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './add-period.component.html',
  styleUrl: './add-period.component.scss',
})
export class AddPeriodComponent {
  readonly dialogRef = inject(MatDialogRef<AddPeriodComponent>);

  newPeriodForm = new FormGroup({
    month: new FormControl('', Validators.required),
    year: new FormControl(0, Validators.required),
  });
  periodMonths = Object.values(PeriodMonth);
  periodYears: number[] = [];

  constructor() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
      this.periodYears.push(year);
    }
  }

  onSubmit(): void {
    console.log('this.newPeriodForm.valid :>> ', this.newPeriodForm.valid);
    if (this.newPeriodForm.valid) {
      const createPeriod: CreatePeriodDto = {
        month: this.newPeriodForm.value.month!,
        year: this.newPeriodForm.value.year!,
      };
      console.log('createPeriod :>> ', createPeriod);
      this.dialogRef.close(createPeriod);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
