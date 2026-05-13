import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/AccountServices.service';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deposit.html',
  styleUrl: './deposit.css',
})
export class Deposit implements OnInit {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  accountId: string | null = null;
  amount = 0;
  description = '';
  loading = false;
  error: string | null = null;
  success: string | null = null;

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('account');
  }

  submitDeposit(): void {
    if (!this.accountId || this.amount <= 0) return;
    
    this.loading = true;
    this.error = null;
    this.success = null;
    
    this.accountService.deposit(parseInt(this.accountId), this.amount, this.description).subscribe({
      next: (data) => {
        this.success = 'Deposit successful!';
        this.amount = 0;
        this.description = '';
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to process deposit';
        this.loading = false;
      }
    });
  }
}
