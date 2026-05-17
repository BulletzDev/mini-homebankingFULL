import { CommonModule } from '@angular/common';
import { Component, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../services/AccountServices.service';

export interface Account {
  id: string;
  name: string;
  surname: string;
  currency: string;
}

@Component({
  selector: 'app-all-accounts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './all-accounts.html',
  styleUrls: ['./all-accounts.css']
})
export class AllAccountsComponent implements OnInit {
  accounts = signal<Account[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.accountService.getAccounts().subscribe({
      next: (data) => {
        const mapped = data.map((row: any[]) => ({
          id: String(row[0]),
          name: row[1],
          surname: row[2],
          currency: row[3]
        }));
        this.accounts.set(mapped);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(`Failed to load accounts: ${err.message}`);
        this.loading.set(false);
      }
    });
  }
}
