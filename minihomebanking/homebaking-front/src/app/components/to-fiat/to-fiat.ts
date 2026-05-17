import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AccountService } from '../../services/AccountServices.service';

@Component({
  selector: 'app-to-fiat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './to-fiat.html',
  styleUrl: './to-fiat.css',
})
export class ToFiat implements OnInit {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);

  accountId = signal<number | null>(null);
  accountCurrency = signal('');
  balance = signal<number | null>(null);
  targetCurrency = signal('EUR');
  convertedAmount = signal<number | null>(null);
  conversionCurrency = signal('');
  loading = signal(false);
  pageLoading = signal(true);
  error = signal<string | null>(null);

  displayedBalance = computed(() => this.formatAmount(this.balance()));
  displayedConvertedAmount = computed(() => this.formatAmount(this.convertedAmount()));
  canConvert = computed(() => !!this.accountId() && !!this.targetCurrency().trim() && !this.loading());

  readonly fiatCurrencies: { code: string; label: string }[] = [
    { code: 'AUD', label: 'Australian Dollar' },
    { code: 'BGN', label: 'Bulgarian Lev' },
    { code: 'BRL', label: 'Brazilian Real' },
    { code: 'CAD', label: 'Canadian Dollar' },
    { code: 'CHF', label: 'Swiss Franc' },
    { code: 'CNY', label: 'Chinese Renminbi' },
    { code: 'CZK', label: 'Czech Koruna' },
    { code: 'DKK', label: 'Danish Krone' },
    { code: 'EUR', label: 'Euro' },
    { code: 'GBP', label: 'British Pound' },
    { code: 'HKD', label: 'Hong Kong Dollar' },
    { code: 'HUF', label: 'Hungarian Forint' },
    { code: 'IDR', label: 'Indonesian Rupiah' },
    { code: 'ILS', label: 'Israeli Shekel' },
    { code: 'INR', label: 'Indian Rupee' },
    { code: 'ISK', label: 'Icelandic Króna' },
    { code: 'JPY', label: 'Japanese Yen' },
    { code: 'KRW', label: 'South Korean Won' },
    { code: 'MXN', label: 'Mexican Peso' },
    { code: 'MYR', label: 'Malaysian Ringgit' },
    { code: 'NOK', label: 'Norwegian Krone' },
    { code: 'NZD', label: 'New Zealand Dollar' },
    { code: 'PHP', label: 'Philippine Peso' },
    { code: 'PLN', label: 'Polish Złoty' },
    { code: 'RON', label: 'Romanian Leu' },
    { code: 'SEK', label: 'Swedish Krona' },
    { code: 'SGD', label: 'Singapore Dollar' },
    { code: 'THB', label: 'Thai Baht' },
    { code: 'TRY', label: 'Turkish Lira' },
    { code: 'USD', label: 'US Dollar' },
    { code: 'ZAR', label: 'South African Rand' },
  ];


  ngOnInit(): void {
    const accountParam = this.route.snapshot.paramMap.get('account');
    const parsedAccountId = Number(accountParam);

    if (!accountParam || Number.isNaN(parsedAccountId)) {
      this.error.set('Account not selected.');
      this.pageLoading.set(false);
      return;
    }

    this.accountId.set(parsedAccountId);
    this.loadAccountSummary(parsedAccountId);
  }

  setTargetCurrency(value: string): void {
    this.targetCurrency.set(value.toUpperCase());
  }

  convertToFiat(): void {
    const accountId = this.accountId();
    const currency = this.targetCurrency().trim().toUpperCase();

    if (!accountId || !currency || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.accountService.convertToFiat(accountId, currency).subscribe({
      next: (data) => {
        this.convertedAmount.set(this.readConvertedAmount(data));
        this.conversionCurrency.set(this.readCurrency(data, currency));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(this.readError(err, 'Failed to convert balance.'));
        this.loading.set(false);
      },
    });
  }

  private loadAccountSummary(accountId: number): void {
    this.pageLoading.set(true);

    this.accountService.getBalance(accountId).subscribe({
      next: (balance) => {
        this.balance.set(this.readBalance(balance));
        this.pageLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load account balance.');
        this.pageLoading.set(false);
      },
    });

    this.accountService.getAccountDetails(accountId).subscribe({
      next: (account) => {
        this.accountCurrency.set(this.readAccountCurrency(account));
      },
      error: () => {
        this.accountCurrency.set('');
      },
    });
  }

  private readBalance(balance: any): number {
    if (typeof balance === 'number') {
      return balance;
    }

    if (Array.isArray(balance)) {
      return Number(balance[0]) || 0;
    }

    return Number(balance?.balance ?? balance?.amount ?? balance?.total ?? 0) || 0;
  }

  private readAccountCurrency(account: any): string {
    if (Array.isArray(account)) {
      return account[3] || '';
    }

    return account?.currency || '';
  }

  private readConvertedAmount(data: any): number {
    if (typeof data === 'number') {
      return data;
    }

    if (Array.isArray(data)) {
      return Number(data[0]) || 0;
    }

    return Number(
      data?.convertedBalance ??
      data?.converted_balance ??
      data?.convertedAmount ??
      data?.converted_amount ??
      data?.balance ??
      data?.amount ??
      data?.result ??
      0,
    ) || 0;
  }

  private readCurrency(data: any, fallback: string): string {
    return (
      data?.currency ??
      data?.to ??
      data?.to_currency ??
      data?.targetCurrency ??
      data?.target_currency ??
      fallback
    );
  }

  private readError(err: any, fallback: string): string {
    return err?.error?.error ?? err?.error?.message ?? err?.message ?? fallback;
  }

  private formatAmount(amount: number | null): string {
    if (amount === null || Number.isNaN(amount)) {
      return '0.00';
    }

    return amount.toFixed(2);
  }
}
