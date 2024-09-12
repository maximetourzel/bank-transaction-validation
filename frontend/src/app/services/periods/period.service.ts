import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Period } from '../../models/period';
import { CreatePeriodDto } from '../../models/dto/create-period-dto';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class PeriodService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllPeriods(): Observable<Period[]> {
    return this.http.get<Period[]>(`${this.apiUrl}/periods`);
  }

  createPeriod(createPeriodDto: CreatePeriodDto): Observable<Period> {
    return this.http.post<Period>(`${this.apiUrl}/periods`, createPeriodDto);
  }

  getPeriodById(periodId: string): Observable<Period> {
    return this.http.get<Period>(`${this.apiUrl}/periods/${periodId}`);
  }
}
