import { CommonModule } from '@angular/common';
import { Component, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../services/AccountServices.service';

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
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

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading.set(true);
    this.error.set(null);

    console.log('Fetching all accounts...');
    this.accountService.getAccounts().subscribe({
      next: (data) => {
        console.log('Accounts loaded successfully:', data);
        this.accounts.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading accounts:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        this.error.set(`Failed to load accounts: ${err.message}`);
        this.loading.set(false);
      }
    });
  }
}