export interface BankAccountDTO {
  id: string;
  balance: number;
  currency: string;
  status: string;
  type: 'CA' | 'SA';
  overDraft?: number;
  interestRate?: number;
  createdBy?: string;
  createdAt?: string;
}

export interface AccountDetails {
  accountId: string;
  balance: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  accountOperationDTOS: AccountOperation[];
}

export interface AccountOperation {
  id: number;
  operationDate: Date;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  description: string;
  createdBy?: string;
  createdAt?: string;
}
