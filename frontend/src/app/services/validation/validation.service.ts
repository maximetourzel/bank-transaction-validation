import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Validation } from '../../models/validation';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createValidation(periodId: string): Observable<Validation> {
    return this.http.post<Validation>(
      `${this.apiUrl}/periods/${periodId}/validations`,
      {},
    );
  }

  getValidationForPeriod(periodId: string): Observable<Validation[]> {
    return this.http.get<Validation[]>(
      `${this.apiUrl}/periods/${periodId}/validations`,
    );
  }
}
