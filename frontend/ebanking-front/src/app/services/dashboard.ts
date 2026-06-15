import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface StatsDTO {
  totalCustomers: number;
  totalAccounts: number;
  totalOperations: number;
  totalBalance: number;
}

export interface MonthlyOperationDTO {
  month: number;
  debit: number;
  credit: number;
}

export interface TopCustomerDTO {
  customerId: number;
  customerName: string;
  totalBalance: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private base = `${environment.backendHost}/dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<StatsDTO> {
    return this.http.get<StatsDTO>(`${this.base}/stats`);
  }

  getAccountsByType(): Observable<{ CURRENT: number; SAVING: number }> {
    return this.http.get<{ CURRENT: number; SAVING: number }>(`${this.base}/accounts-by-type`);
  }

  getOperationsPerMonth(year: number): Observable<MonthlyOperationDTO[]> {
    const params = new HttpParams().set('year', year.toString());
    return this.http.get<MonthlyOperationDTO[]>(`${this.base}/operations-per-month`, { params });
  }

  getTopCustomers(): Observable<TopCustomerDTO[]> {
    return this.http.get<TopCustomerDTO[]>(`${this.base}/top-customers`);
  }
}
