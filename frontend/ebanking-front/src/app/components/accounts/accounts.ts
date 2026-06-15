import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccountDetails } from '../../model/account.model';
import { AccountsService } from '../../services/accounts';

@Component({
  selector: 'app-accounts',
  standalone: false,
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class Accounts implements OnInit {
  accountIdControl: FormControl = new FormControl('', Validators.required);
  accountDetails: AccountDetails | null = null;
  errorMessage: string = '';
  currentPage: number = 0;
  pageSize: number = 5;

  operationFormGroup: FormGroup = new FormGroup({
    operationType: new FormControl('DEBIT', Validators.required),
    amount: new FormControl('', [Validators.required, Validators.min(1)]),
    description: new FormControl('', Validators.required),
    accountDestination: new FormControl('')
  });

  constructor(
    private accountsService: AccountsService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Pré-remplir l'ID si on vient de la page customer-accounts
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.accountIdControl.setValue(id);
      this.handleSearchAccount();
    }
  }

  handleSearchAccount(): void {
    const id = this.accountIdControl.value?.trim();
    if (!id) return;
    this.accountsService.getAccount(id, this.currentPage, this.pageSize).subscribe({
      next: (data) => { this.accountDetails = data; this.errorMessage = ''; this.cdr.detectChanges(); },
      error: (err) => { this.errorMessage = err.error?.error ?? err.message; this.accountDetails = null; this.cdr.detectChanges(); }
    });
  }

  handlePageChange(page: number): void {
    this.currentPage = page;
    this.handleSearchAccount();
  }

  handleAccountOperation(): void {
    if (this.operationFormGroup.invalid) return;
    const { operationType, amount, description, accountDestination } = this.operationFormGroup.value;
    const accountId = this.accountIdControl.value;

    let op$;
    if (operationType === 'DEBIT') {
      op$ = this.accountsService.debit(accountId, amount, description);
    } else if (operationType === 'CREDIT') {
      op$ = this.accountsService.credit(accountId, amount, description);
    } else {
      op$ = this.accountsService.transfer(accountId, accountDestination, amount, description);
    }

    op$.subscribe({
      next: () => {
        alert('Operation completed successfully!');
        this.operationFormGroup.reset({ operationType: 'DEBIT' });
        this.handleSearchAccount();
        this.cdr.detectChanges();
      },
      error: (err) => { alert(err.error?.error ?? err.message); this.cdr.detectChanges(); }
    });
  }
}
