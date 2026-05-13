import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/AccountServices.service';

@Component({
  selector: 'app-get-balance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './get-balance.html',
  styleUrl: './get-balance.css',
})
export class GetBalance implements OnInit {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  accountId: string | null = null;
  balance: any = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('account');
    if (this.accountId) {
      this.loading = true;
      this.accountService.getBalance(parseInt(this.accountId)).subscribe({
        next: (data) => {
          this.balance = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load balance';
          this.loading = false;
        }
      });
    }
  }
}
