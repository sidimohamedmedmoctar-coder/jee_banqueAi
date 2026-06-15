import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserDTO } from './user-management';

export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class Account {

  private base = `${environment.backendHost}/account`;

  constructor(private http: HttpClient) {}

  me(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.base}/me`);
  }

  changePassword(dto: ChangePasswordDTO): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.base}/change-password`, dto);
  }
}
