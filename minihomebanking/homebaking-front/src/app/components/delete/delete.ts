import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService } from '../../services/AccountServices.service';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './delete.html',
  styleUrl: './delete.css',
})
export class Delete implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private accountService = inject(AccountService);
  accountId: string | null = null;
  transactionId: string | null = null;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('account');
    this.transactionId = this.route.snapshot.paramMap.get('transactionId');
  }

  deleteTransaction(): void {
    if (!this.accountId || !this.transactionId || this.loading) return;

    this.loading = true;
    this.error = null;
    this.success = null;

    this.accountService.deleteTransaction(parseInt(this.accountId, 10), parseInt(this.transactionId, 10)).subscribe({
      next: () => {
        this.success = 'Transaction deleted successfully!';
        this.loading = false;
        this.router.navigate(['/accounts', this.accountId, 'transactions']);
      },
      error: () => {
        this.error = 'Failed to delete transaction.';
        this.loading = false;
      }
    });
  }
}
