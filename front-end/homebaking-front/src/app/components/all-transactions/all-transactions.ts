import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AccountService } from '../../services/AccountServices.service';


@Component({
  selector: 'app-all-transactions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './all-transactions.html',
  styleUrl: './all-transactions.css',
})
export class AllTransactions implements OnInit {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  accountId: string | null = null;
  transactions: any[] = [];
  loading = signal(true);
  error: string | null = null;

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('account');
    this.loadTransactions();
  }

  loadTransactions(): void {
    if (!this.accountId) {
      this.error = 'Account not selected.';
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error = null;

    this.accountService.getTransactions(parseInt(this.accountId, 10))
      .pipe(finalize(() => {
        this.loading.set(false);
      }))
      .subscribe({
        next: (data) => {
          const payload: any = data;
          const rows = Array.isArray(payload)
            ? payload
            : payload?.data ?? payload?.rows ?? payload?.result ?? [];
          this.transactions = this.mapTransactions(rows);
        },
        error: () => {
          this.error = 'Failed to load transactions.';
        }
      });
  }

  private mapTransactions(rows: any[]): any[] {
    if (!Array.isArray(rows)) {
      return [];
    }
    return rows.map((row) => {
      if (Array.isArray(row)) {
        return {
          id: row[0],
          account_id: row[1],
          type: row[2],
          amount: row[3],
          description: row[4],
          created_at: row[5]
        };
      }
      return row;
    });
  }
}
