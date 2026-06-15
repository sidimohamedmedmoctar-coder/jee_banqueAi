import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export interface CreateUserDTO {
  username: string;
  password: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UserManagement {

  private base = `${environment.backendHost}/admin/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.base);
  }

  createUser(dto: CreateUserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.base, dto);
  }

  addRole(id: number, role: string): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.base}/${id}/roles`, null, {
      params: { role }
    });
  }

  removeRole(id: number, roleName: string): Observable<UserDTO> {
    return this.http.delete<UserDTO>(`${this.base}/${id}/roles/${roleName}`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
