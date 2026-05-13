import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/AccountServices.service';

@Component({
  selector: 'app-all-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-transactions.html',
  styleUrl: './all-transactions.css',
})
export class AllTransactions implements OnInit {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  accountId: string | null = null;
  transactions: any[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('account');
    if (this.accountId) {
      this.loading = true;
      this.accountService.getTransactions(parseInt(this.accountId)).subscribe({
        next: (data) => {
          this.transactions = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load transactions';
          this.loading = false;
        }
      });
    }
  }
}
