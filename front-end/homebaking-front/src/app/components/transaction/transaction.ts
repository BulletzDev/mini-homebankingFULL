import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AccountService } from '../../services/AccountServices.service';

interface TransactionView {
  id: string | number;
  accountId: string | number;
  type: string;
  amount: string | number;
  description: string;
  createdAt: string;
  isCredit: boolean;
}

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './transaction.html',
  styleUrl: './transaction.css',
})
export class Transaction implements OnInit {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);

  accountId = signal<number | null>(null);
  transactionId = signal<number | null>(null);
  transaction = signal<TransactionView | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  title = computed(() => this.transaction()?.description || 'Transaction detail');

  ngOnInit(): void {
    const accountParam = this.route.snapshot.paramMap.get('account');
    const transactionParam = this.route.snapshot.paramMap.get('transactionId');
    const parsedAccountId = Number(accountParam);
    const parsedTransactionId = Number(transactionParam);

    if (
      !accountParam ||
      !transactionParam ||
      Number.isNaN(parsedAccountId) ||
      Number.isNaN(parsedTransactionId)
    ) {
      this.error.set('Transaction not selected.');
      this.loading.set(false);
      return;
    }

    this.accountId.set(parsedAccountId);
    this.transactionId.set(parsedTransactionId);
    this.loadTransaction(parsedAccountId, parsedTransactionId);
  }

  private loadTransaction(accountId: number, transactionId: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.accountService.getTransaction(accountId, transactionId).subscribe({
      next: (data) => {
        this.transaction.set(this.mapTransaction(data));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load transaction.');
        this.loading.set(false);
      },
    });
  }

  private mapTransaction(row: any): TransactionView {
    const type = Array.isArray(row) ? row[2] || '' : row?.type || '';

    return {
      id: Array.isArray(row) ? row[0] : row?.id,
      accountId: Array.isArray(row) ? row[1] : row?.account_id,
      type,
      amount: Array.isArray(row) ? row[3] : row?.amount,
      description: (Array.isArray(row) ? row[4] : row?.description) || 'No description',
      createdAt: (Array.isArray(row) ? row[5] : row?.created_at || row?.createdAt) || 'No date',
      isCredit: this.isCredit(type),
    };
  }

  private isCredit(type: string): boolean {
    const normalizedType = type.toLowerCase();
    return normalizedType === 'deposit' || normalizedType === 'credit' || normalizedType === 'entrata';
  }
}
