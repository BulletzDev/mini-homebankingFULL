import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/AccountServices.service';

@Component({
  selector: 'app-to-fiat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './to-fiat.html',
  styleUrl: './to-fiat.css',
})
export class ToFiat implements OnInit {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  accountId: string | null = null;
  currency = 'EUR';
  convertedBalance: any = null;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('account');
  }

  convertToFiat(): void {
    if (!this.accountId) return;
    
    this.loading = true;
    this.error = null;
    
    this.accountService.convertToFiat(parseInt(this.accountId), this.currency).subscribe({
      next: (data) => {
        this.convertedBalance = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to convert balance';
        this.loading = false;
      }
    });
  }
}
