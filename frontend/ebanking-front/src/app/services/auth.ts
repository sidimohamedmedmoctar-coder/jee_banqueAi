import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

interface JwtPayload {
  sub: string;
  roles: string[];
  scope: string;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private static readonly TOKEN_KEY = 'auth_token';

  private _isAuthenticated = false;
  private _username      = '';
  private _roles: string[] = [];
  private _accessToken   = '';

  constructor(private http: HttpClient) {
    // Restaurer la session depuis localStorage au démarrage de l'application
    const savedToken = localStorage.getItem(AuthService.TOKEN_KEY);
    if (savedToken) {
      try {
        this.loadProfile(savedToken);
      } catch {
        // Token corrompu ou expiré — nettoyer
        localStorage.removeItem(AuthService.TOKEN_KEY);
      }
    }
  }

  // ── Authentification ─────────────────────────────────────────────────────

  login(username: string, password: string) {
    return this.http.post<{ 'access-token': string }>(
      `${environment.backendHost}/auth/login`,
      { username, password }
    ).pipe(
      tap(response => this.loadProfile(response['access-token']))
    );
  }

  loadProfile(token: string): void {
    this._accessToken = token;
    const decoded = jwtDecode<JwtPayload>(token);
    this._username        = decoded.sub;
    this._roles           = decoded.roles ?? [];
    this._isAuthenticated = true;
    // Persister le token pour survivre aux rechargements de page
    localStorage.setItem(AuthService.TOKEN_KEY, token);
  }

  logout(): void {
    this._isAuthenticated = false;
    this._username        = '';
    this._roles           = [];
    this._accessToken     = '';
    localStorage.removeItem(AuthService.TOKEN_KEY);
  }

  // ── Accesseurs ───────────────────────────────────────────────────────────

  get isAuthenticated(): boolean { return this._isAuthenticated; }
  get username(): string         { return this._username; }
  get roles(): string[]          { return this._roles; }
  get accessToken(): string      { return this._accessToken; }

  hasRole(role: string): boolean {
    return this._roles.includes(role);
  }

  /** Retourne true si le token JWT est expiré (ou absent). */
  isTokenExpired(): boolean {
    if (!this._accessToken) return true;
    try {
      const decoded = jwtDecode<JwtPayload>(this._accessToken);
      // exp est en secondes (Unix timestamp)
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
