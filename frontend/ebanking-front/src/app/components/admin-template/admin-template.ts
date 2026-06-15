import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-template',
  standalone: false,
  templateUrl: './admin-template.html',
  styleUrl: './admin-template.css',
})
export class AdminTemplate {

  constructor(public authService: AuthService, private router: Router) {}

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
