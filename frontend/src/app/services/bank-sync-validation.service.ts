import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Period } from '../models/period'; // Exemple de modèle à créer
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class BankSyncValidationService {
  private apiUrl = environment.apiUrl + '/api'; // Remplacer par l'URL de ton API

  constructor(private http: HttpClient) {}

  // Récupérer toutes les périodes
  getPeriods(): Observable<Period[]> {
    return this.http.get<Period[]>(`${this.apiUrl}/periods`);
  }

  // Récupérer les mouvements d'une période
  getMovementsForPeriod(periodId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/periods/${periodId}/movements`);
  }

  // Créer un nouveau mouvement bancaire
  createMovement(periodId: string, movementData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/periods/${periodId}/movements`,
      movementData,
    );
  }

  // Récupérer les checkpoints
  getCheckpointsForPeriod(periodId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/periods/${periodId}/checkpoints`,
    );
  }

  // Créer une validation pour une période
  createValidation(periodId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/periods/${periodId}/validations`, {});
  }
}
