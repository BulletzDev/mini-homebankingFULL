import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/AccountServices.service';

@Component({
  selector: 'app-to-crypto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './to-crypto.html',
  styleUrl: './to-crypto.css',
})
export class ToCrypto implements OnInit {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  accountId: string | null = null;
  currency = 'BTC';
  convertedBalance: any = null;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('account');
  }

  convertToCrypto(): void {
    if (!this.accountId) return;
    
    this.loading = true;
    this.error = null;
    
    this.accountService.convertToCrypto(parseInt(this.accountId), this.currency).subscribe({
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
