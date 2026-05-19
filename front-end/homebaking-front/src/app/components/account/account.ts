import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/AccountServices.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account.html',
  styleUrls: ['./account.css']
})
export class AccountComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);

  accountDetails = signal<any>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    const accountId = this.route.snapshot.paramMap.get('account');
    if (accountId) {
      this.loadAccountData(accountId);
    }
  }

  loadAccountData(accountId: string) {
    this.loading.set(true);
    this.error.set(null);

    const id = parseInt(accountId, 10);
    this.accountService.getAccountDetails(id).subscribe({
      next: (account) => {
        this.accountDetails.set(this.mapAccount(account));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load account details.');
        this.loading.set(false);
      }
    });
  }

  private mapAccount(row: any): any {
    if (!row) {
      return null;
    }
    if (Array.isArray(row)) {
      return {
        id: String(row[0]),
        name: row[1],
        surname: row[2],
        currency: row[3],
        created_at: row[4]
      };
    }
    return row;
  }
}
