import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer';

@Component({
  selector: 'app-new-customer',
  standalone: false,
  templateUrl: './new-customer.html',
  styleUrl: './new-customer.css',
})
export class NewCustomer {
  newCustomerFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private customerService: CustomerService, private router: Router) {}

  handleSaveCustomer(): void {
    if (this.newCustomerFormGroup.invalid) return;
    const customer = this.newCustomerFormGroup.value;
    this.customerService.saveCustomer(customer).subscribe({
      next: () => {
        this.successMessage = 'Customer created successfully!';
        this.newCustomerFormGroup.reset();
        setTimeout(() => this.router.navigate(['/admin/customers']), 1500);
      },
      error: (err) => { this.errorMessage = err.message; }
    });
  }
}
