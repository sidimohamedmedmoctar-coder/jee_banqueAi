import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Account } from '../../services/account';

// ── Validateurs personnalisés ────────────────────────────────────────────────

/** Vérifie qu'au moins un chiffre est présent dans le mot de passe. */
const digitValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null =>
  /\d/.test(control.value ?? '') ? null : { noDigit: true };

/** Vérifie que newPassword === confirmNewPassword (validateur de groupe). */
const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const np = group.get('newPassword')?.value;
  const cp = group.get('confirmNewPassword')?.value;
  return np === cp ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {

  successMessage = '';
  errorMessage   = '';
  loading        = false;

  form = new FormGroup(
    {
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        digitValidator,
      ]),
      confirmNewPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator }
  );

  constructor(private accountService: Account) {}

  get np() { return this.form.get('newPassword'); }
  get cp() { return this.form.get('confirmNewPassword'); }

  handleSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.successMessage = '';
    this.errorMessage   = '';

    const { oldPassword, newPassword } = this.form.value;

    this.accountService.changePassword({ oldPassword: oldPassword!, newPassword: newPassword! })
      .subscribe({
        next: (res) => {
          this.successMessage = res.message;
          this.form.reset();
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.error ?? 'Une erreur est survenue.';
          this.loading = false;
        },
      });
  }
}
