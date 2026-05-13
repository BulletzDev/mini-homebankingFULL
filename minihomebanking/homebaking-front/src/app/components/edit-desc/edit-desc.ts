import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/AccountServices.service';

@Component({
  selector: 'app-edit-desc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-desc.html',
  styleUrl: './edit-desc.css',
})
export class EditDesc implements OnInit {
  private route = inject(ActivatedRoute);
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
    if (!this.accountId || !this.transactionId) return;
    
    this.loading = true;
    this.error = null;
    this.success = null;
    
    this.accountService.updateTransaction(parseInt(this.accountId), parseInt(this.transactionId), this.description).subscribe({
      next: () => {
        this.success = 'Description updated successfully!';
        this.description = '';
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to update description';
        this.loading = false;
      }
    });
  }
}
