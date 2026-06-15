import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }
    // Vérifier que le token JWT n'est pas expiré
    if (this.authService.isTokenExpired()) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
