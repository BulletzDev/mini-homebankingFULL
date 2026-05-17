import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService } from '../../services/AccountServices.service';

@Component({
  selector: 'app-edit-desc',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-desc.html',
  styleUrl: './edit-desc.css',
})
export class EditDesc implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private accountService = inject(AccountService);
  accountId: string | null = null;
  transactionId: string | null = null;
  description = '';
  loading = false;
  error: string | null = null;
  success: string | null = null;

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('account');
    this.transactionId = this.route.snapshot.paramMap.get('transactionId');
  }

  updateDescription(): void {
    if (!this.accountId || !this.transactionId || this.loading) return;

    this.loading = true;
    this.error = null;
    this.success = null;

    this.accountService.updateTransaction(parseInt(this.accountId, 10), parseInt(this.transactionId, 10), this.description.trim()).subscribe({
      next: () => {
        this.success = 'Description updated successfully!';
        this.description = '';
        this.loading = false;
        this.router.navigate(['/accounts', this.accountId, 'transactions']);
      },
      error: () => {
        this.error = 'Failed to update description.';
        this.loading = false;
      }
    });
  }
}
