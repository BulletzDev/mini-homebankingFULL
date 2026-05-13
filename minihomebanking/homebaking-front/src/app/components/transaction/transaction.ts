import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/AccountServices.service';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction.html',
  styleUrl: './transaction.css',
})
export class Transaction implements OnInit {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  accountId: string | null = null;
  transactionId: string | null = null;
  transaction: any = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('account');
    this.transactionId = this.route.snapshot.paramMap.get('transactionId');
    
    if (this.accountId && this.transactionId) {
      this.accountService.getTransaction(parseInt(this.accountId), parseInt(this.transactionId)).subscribe({
        next: (data) => {
          this.transaction = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load transaction';
          this.loading = false;
        }
      });
    }
  }
}
