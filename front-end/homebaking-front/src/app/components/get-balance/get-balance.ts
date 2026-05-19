import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AccountService } from '../../services/AccountServices.service';

interface BalanceTransaction {
  id: string | number;
  type: string;
  amount: number;
  description: string;
  created_at: string;
}

interface BalanceTransactionView extends BalanceTransaction {
  signedAmount: string;
  isCredit: boolean;
}

@Component({
  selector: 'app-get-balance',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './get-balance.html',
  styleUrl: './get-balance.css',
})
export class GetBalance implements OnInit {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);

  accountId = signal<number | null>(null);
  balance = signal(0);
  currency = signal('');
  transactions = signal<BalanceTransaction[]>([]);
  loading = signal(true);
  transactionsLoading = signal(false);
  error = signal<string | null>(null);
  transactionsError = signal<string | null>(null);

  displayedBalance = computed(() => this.formatAmount(this.balance()));

  transactionViews = computed<BalanceTransactionView[]>(() =>
    this.transactions().map((transaction) => {
      const isCredit = this.isCredit(transaction);
      const sign = isCredit ? '+' : '-';

      return {
        ...transaction,
        isCredit,
        signedAmount: `${sign}${this.formatAmount(transaction.amount)}`,
      };
    }),
  );

  credits = computed(() => this.transactionViews().filter((transaction) => transaction.isCredit));
  debits = computed(() => this.transactionViews().filter((transaction) => !transaction.isCredit));
  totalCredits = computed(() =>
    this.credits().reduce((total, transaction) => total + transaction.amount, 0),
  );
  totalDebits = computed(() =>
    this.debits().reduce((total, transaction) => total + transaction.amount, 0),
  );
  calculatedBalance = computed(() => this.totalCredits() - this.totalDebits());
  displayedTotalCredits = computed(() => this.formatAmount(this.totalCredits()));
  displayedTotalDebits = computed(() => this.formatAmount(this.totalDebits()));
  displayedCalculatedBalance = computed(() => this.formatAmount(this.calculatedBalance()));

  ngOnInit(): void {
    const accountParam = this.route.snapshot.paramMap.get('account');
    const parsedAccountId = Number(accountParam);

    if (!accountParam || Number.isNaN(parsedAccountId)) {
      this.accountId.set(null);
      this.error.set('Account not selected.');
      this.loading.set(false);
      return;
    }

    this.accountId.set(parsedAccountId);
    this.loadBalance(parsedAccountId);
    this.loadAccountCurrency(parsedAccountId);
    this.loadTransactions(parsedAccountId);
  }

  private loadBalance(accountId: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.accountService.getBalance(accountId).subscribe({
      next: (balance) => {
        this.balance.set(this.readBalance(balance));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load balance.');
        this.loading.set(false);
      },
    });
  }

  private loadAccountCurrency(accountId: number): void {
    this.accountService.getAccountDetails(accountId).subscribe({
      next: (account) => {
        this.currency.set(this.readCurrency(account));
      },
      error: () => {
        this.currency.set('');
      },
    });
  }

  private loadTransactions(accountId: number): void {
    this.transactionsLoading.set(true);
    this.transactionsError.set(null);

    this.accountService.getTransactions(accountId).subscribe({
      next: (transactions) => {
        this.transactions.set(this.mapTransactions(transactions));
        this.transactionsLoading.set(false);
      },
      error: () => {
        this.transactionsError.set('Failed to load transaction breakdown.');
        this.transactionsLoading.set(false);
      },
    });
  }

  private formatAmount(amount: number): string {
    if (Number.isNaN(amount)) {
      return '0.00';
    }

    return amount.toFixed(2);
  }

  private isCredit(transaction: BalanceTransaction): boolean {
    const type = transaction.type.toLowerCase();
    return type === 'deposit' || type === 'credit' || type === 'entrata';
  }

  private readBalance(balance: any): number {
    if (typeof balance === 'number') {
      return balance;
    }

    if (Array.isArray(balance)) {
      return Number(balance[0]) || 0;
    }

    return Number(balance?.balance ?? balance?.amount ?? balance?.total ?? 0) || 0;
  }

  private readCurrency(account: any): string {
    if (Array.isArray(account)) {
      return account[3] || '';
    }

    return account?.currency || '';
  }

  private mapTransactions(payload: any): BalanceTransaction[] {
    const rows = Array.isArray(payload)
      ? payload
      : payload?.data ?? payload?.rows ?? payload?.result ?? [];

    if (!Array.isArray(rows)) {
      return [];
    }

    return rows.map((row) => {
      if (Array.isArray(row)) {
        return {
          id: row[0],
          type: row[2] || '',
          amount: Number(row[3]) || 0,
          description: row[4] || 'No description',
          created_at: row[5] || '',
        };
      }

      return {
        id: row.id,
        type: row.type || '',
        amount: Number(row.amount) || 0,
        description: row.description || 'No description',
        created_at: row.created_at || row.createdAt || '',
      };
    });
  }
}
