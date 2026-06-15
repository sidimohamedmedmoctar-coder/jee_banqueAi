import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginFormGroup: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  handleLogin(): void {
    if (this.loginFormGroup.invalid) return;
    const { username, password } = this.loginFormGroup.value;

    this.authService.login(username, password).subscribe({
      next: () => this.router.navigate(['/admin/customers']),
      error: () => (this.errorMessage = 'Identifiants invalides. Vérifiez votre username/mot de passe.'),
    });
  }
}
