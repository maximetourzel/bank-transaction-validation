import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Checkpoint } from '../../models/checkpoint';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class BalanceCheckpointService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCheckpointsForPeriod(periodId: string): Observable<Checkpoint[]> {
    return this.http.get<Checkpoint[]>(
      `${this.apiUrl}/periods/${periodId}/checkpoints`,
    );
  }
}
