import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../model/customer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {

  private backendHost = environment.backendHost;

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.backendHost}/customers`);
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.backendHost}/customers/${id}`);
  }

  searchCustomers(keyword: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.backendHost}/customers/search?keyword=${keyword}`);
  }

  saveCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.backendHost}/customers`, customer);
  }

  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.backendHost}/customers/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.backendHost}/customers/${id}`);
  }
}
