import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountDetails, BankAccountDTO } from '../model/account.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {

  private backendHost = environment.backendHost;

  constructor(private http: HttpClient) {}

  getAccount(id: string, page: number, size: number): Observable<AccountDetails> {
    return this.http.get<AccountDetails>(
      `${this.backendHost}/accounts/${id}/pageOperations?page=${page}&size=${size}`
    );
  }

  getCustomerAccounts(customerId: number): Observable<BankAccountDTO[]> {
    return this.http.get<BankAccountDTO[]>(`${this.backendHost}/accounts/customer/${customerId}`);
  }

  createCurrentAccount(customerId: number, initialBalance: number, overDraft: number): Observable<BankAccountDTO> {
    return this.http.post<BankAccountDTO>(`${this.backendHost}/accounts/current`, {
      customerId, initialBalance, overDraft
    });
  }

  createSavingAccount(customerId: number, initialBalance: number, interestRate: number): Observable<BankAccountDTO> {
    return this.http.post<BankAccountDTO>(`${this.backendHost}/accounts/saving`, {
      customerId, initialBalance, interestRate
    });
  }

  debit(accountId: string, amount: number, description: string): Observable<any> {
    return this.http.post<any>(`${this.backendHost}/accounts/debit`, {
      accountId, amount, description
    });
  }

  credit(accountId: string, amount: number, description: string): Observable<any> {
    return this.http.post<any>(`${this.backendHost}/accounts/credit`, {
      accountId, amount, description
    });
  }

  transfer(accountSource: string, accountDestination: string, amount: number, description: string): Observable<any> {
    return this.http.post<any>(`${this.backendHost}/accounts/transfer`, {
      accountSource, accountDestination, amount, description
    });
  }
}
