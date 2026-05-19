import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService } from '../../services/AccountServices.service';

@Component({
  selector: 'app-withdraw',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './withdraw.html',
  styleUrl: './withdraw.css',
})
export class Withdraw implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private accountService = inject(AccountService);
  private formBuilder = inject(NonNullableFormBuilder);

  accountId = signal<number | null>(null);
  withdrawForm = this.formBuilder.group({
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    description: ['', [Validators.maxLength(120)]],
  });

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  ngOnInit(): void {
    const accountParam = this.route.snapshot.paramMap.get('account');
    const parsedAccountId = Number(accountParam);

    if (!accountParam || Number.isNaN(parsedAccountId)) {
      this.accountId.set(null);
      this.error.set('Invalid account selected.');
      this.withdrawForm.disable();
      return;
    }

    this.accountId.set(parsedAccountId);
  }

  submitWithdraw(): void {
    this.withdrawForm.markAllAsTouched();

    const currentAccountId = this.accountId();
    if (!currentAccountId || this.withdrawForm.invalid || this.loading()) {
      return;
    }

    const { amount, description } = this.withdrawForm.getRawValue();

    if (amount === null) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    this.accountService.withdraw(currentAccountId, amount, description.trim()).subscribe({
      next: () => {
        this.success.set('Withdrawal completed successfully.');
        this.withdrawForm.reset({ amount: null, description: '' });
        this.loading.set(false);

        setTimeout(() => {
          this.router.navigate(['/accounts', currentAccountId]);
        }, 800);
      },
      error: (err) => {
        this.error.set(err?.error?.error || err?.error?.message || err?.message || 'Failed to process withdrawal.');
        this.loading.set(false);
      },
    });
  }

  get amountInvalid(): boolean {
    const amount = this.withdrawForm.controls.amount;
    return amount.invalid && (amount.dirty || amount.touched);
  }

  get descriptionInvalid(): boolean {
    const description = this.withdrawForm.controls.description;
    return description.invalid && (description.dirty || description.touched);
  }
}
