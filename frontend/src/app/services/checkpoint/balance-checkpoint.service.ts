import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Checkpoint } from '../../models/checkpoint';
import { environment } from '../../../environments/environments';
import { CreateBalanceCheckpointDto } from '../../models/dto/create-balance-checkpoint-dto';

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

  createCheckpoint(
    periodId: string,
    createBalanceCheckpointDto: CreateBalanceCheckpointDto,
  ): Observable<Checkpoint> {
    return this.http.post<Checkpoint>(
      `${this.apiUrl}/periods/${periodId}/checkpoints`,
      createBalanceCheckpointDto,
    );
  }

  deleteCheckpoint(checkpointId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/checkpoints/${checkpointId}`);
  }
}
