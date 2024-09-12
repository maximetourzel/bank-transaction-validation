import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movement } from '../../models/movement';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class BankMovementService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createMovement(movement: Movement): Observable<Movement> {
    return this.http.post<Movement>(`${this.apiUrl}/movements`, movement);
  }

  getMovementsForPeriod(periodId: string): Observable<Movement[]> {
    return this.http.get<Movement[]>(
      `${this.apiUrl}/periods/${periodId}/movements`,
    );
  }

  deleteMovement(movementId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/movements/${movementId}`);
  }
}
