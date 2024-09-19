import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movement } from '../../models/movement';
import { environment } from '../../../environments/environments';
import { CreateBankMovementDto } from '../../models/dto/create-bank-movement-dto';

@Injectable({
  providedIn: 'root',
})
export class BankMovementService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createMovement(
    periodId: string,
    createBankMovementDto: CreateBankMovementDto,
  ): Observable<Movement> {
    return this.http.post<Movement>(
      `${this.apiUrl}/periods/${periodId}/movements`,
      createBankMovementDto,
    );
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
