import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer';
import { AccountsService } from '../../services/accounts';
import { AuthService } from '../../services/auth';
import { Customer } from '../../model/customer.model';
import { BankAccountDTO } from '../../model/account.model';

@Component({
  selector: 'app-customer-accounts',
  standalone: false,
  templateUrl: './customer-accounts.html',
  styleUrl: './customer-accounts.css',
})
export class CustomerAccounts implements OnInit {

  customerId!: number;
  customer: Customer | null = null;
  accounts: BankAccountDTO[] = [];
  errorMessage = '';
  showAddForm  = false;

  addAccountForm = new FormGroup({
    type:           new FormControl('CURRENT', Validators.required),
    initialBalance: new FormControl(0, [Validators.required, Validators.min(0)]),
    overDraft:      new FormControl(1000),
    interestRate:   new FormControl(3.5),
  });

  constructor(
    private route:           ActivatedRoute,
    private router:          Router,
    private customerService: CustomerService,
    private accountsService: AccountsService,
    public  authService:     AuthService,
    private cdr:             ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.customerId = +this.route.snapshot.paramMap.get('id')!;
    this.loadCustomer();
    this.loadAccounts();
  }

  loadCustomer(): void {
    this.customerService.getCustomer(this.customerId).subscribe({
      next: (c) => { this.customer = c; this.cdr.detectChanges(); },
      error: ()  => { this.errorMessage = 'Client introuvable.'; this.cdr.detectChanges(); }
    });
  }

  loadAccounts(): void {
    this.accountsService.getCustomerAccounts(this.customerId).subscribe({
      next: (data) => { this.accounts = data; this.cdr.detectChanges(); },
      error: ()    => { this.errorMessage = 'Impossible de charger les comptes.'; this.cdr.detectChanges(); }
    });
  }

  handleViewOperations(accountId: string): void {
    this.router.navigate(['/admin/accounts'], { queryParams: { id: accountId } });
  }

  handleAddAccount(): void {
    if (this.addAccountForm.invalid) return;
    const { type, initialBalance, overDraft, interestRate } = this.addAccountForm.value;
    const balance = initialBalance ?? 0;

    const obs$ = type === 'CURRENT'
      ? this.accountsService.createCurrentAccount(this.customerId, balance, overDraft ?? 1000)
      : this.accountsService.createSavingAccount(this.customerId, balance, interestRate ?? 3.5);

    obs$.subscribe({
      next: (account) => {
        this.accounts = [...this.accounts, account];
        this.showAddForm = false;
        this.addAccountForm.reset({ type: 'CURRENT', initialBalance: 0, overDraft: 1000, interestRate: 3.5 });
        this.cdr.detectChanges();
      },
      error: () => { this.errorMessage = 'Erreur lors de la création du compte.'; this.cdr.detectChanges(); }
    });
  }

  get accountType(): string {
    return this.addAccountForm.get('type')?.value ?? 'CURRENT';
  }
}
