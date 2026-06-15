import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer';

@Component({
  selector: 'app-edit-customer',
  standalone: false,
  templateUrl: './edit-customer.html',
  styleUrl: './edit-customer.css',
})
export class EditCustomer implements OnInit {

  customerId!: number;
  successMessage = '';
  errorMessage   = '';

  editForm: FormGroup = new FormGroup({
    name:  new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.customerId = +this.route.snapshot.paramMap.get('id')!;
    this.customerService.getCustomer(this.customerId).subscribe({
      next: (c) => {
        this.editForm.patchValue({ name: c.name, email: c.email });
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger le client.';
        this.cdr.detectChanges();
      },
    });
  }

  handleUpdate(): void {
    if (this.editForm.invalid) return;
    const { name, email } = this.editForm.value;
    this.customerService.updateCustomer(this.customerId, { id: this.customerId, name, email }).subscribe({
      next: () => {
        this.successMessage = 'Client mis à jour avec succès !';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/admin/customers']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.cdr.detectChanges();
      },
    });
  }
}
