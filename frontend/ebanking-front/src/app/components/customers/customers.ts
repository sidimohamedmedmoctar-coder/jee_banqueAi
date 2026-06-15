import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer } from '../../model/customer.model';
import { CustomerService } from '../../services/customer';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-customers',
  standalone: false,
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers implements OnInit {
  customers: Customer[]  = [];
  errorMessage: string   = '';
  deletingId:   number | string | null = null;   // anti double-clic
  searchKeyword: FormControl = new FormControl('');

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.handleGetCustomers();
  }

  handleGetCustomers(): void {
    this.errorMessage = '';
    this.customerService.getCustomers().subscribe({
      next:  (data) => { this.customers = data; this.cdr.detectChanges(); },
      error: (err)  => { this.errorMessage = err.message; this.cdr.detectChanges(); }
    });
  }

  handleSearchCustomers(): void {
    const keyword = this.searchKeyword.value ?? '';
    this.customerService.searchCustomers(keyword).subscribe({
      next:  (data) => { this.customers = data; this.cdr.detectChanges(); },
      error: (err)  => { this.errorMessage = err.message; this.cdr.detectChanges(); }
    });
  }

  handleDeleteCustomer(c: Customer): void {
    if (this.deletingId !== null) return;                     // requête en cours
    if (!confirm(`Supprimer le client "${c.name}" ?`)) return;

    this.deletingId   = c.id!;
    this.errorMessage = '';

    this.customerService.deleteCustomer(c.id!).subscribe({
      next: () => {
        this.customers  = this.customers.filter(x => x.id !== c.id);
        this.deletingId = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.deletingId   = null;
        this.cdr.detectChanges();
      }
    });
  }

  handleEditCustomer(c: Customer): void {
    this.router.navigate(['/admin/edit-customer', c.id]);
  }

  handleAccounts(c: Customer): void {
    this.router.navigate(['/admin/customer-accounts', c.id]);
  }
}
