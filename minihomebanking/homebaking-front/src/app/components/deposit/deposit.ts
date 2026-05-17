import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService } from '../../services/AccountServices.service';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './deposit.html',
  styleUrl: './deposit.css',
})
export class Deposit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private accountService = inject(AccountService);
  private formBuilder = inject(NonNullableFormBuilder);

  accountId: number | null = null;
  depositForm = this.formBuilder.group({
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    description: ['', [Validators.maxLength(120)]],
  });

  loading = false;
  error: string | null = null;
  success: string | null = null;

  ngOnInit(): void {
    const accountParam = this.route.snapshot.paramMap.get('account');
    const parsedAccountId = Number(accountParam);

    if (!accountParam || Number.isNaN(parsedAccountId)) {
      this.accountId = null;
      this.error = 'Invalid account selected.';
      this.depositForm.disable();
      return;
    }

    this.accountId = parsedAccountId;
  }

  submitDeposit(): void {
    this.depositForm.markAllAsTouched();

    if (!this.accountId || this.depositForm.invalid || this.loading) {
      return;
    }

    const { amount, description } = this.depositForm.getRawValue();

    if (amount === null) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    this.accountService.deposit(this.accountId, amount, description.trim()).subscribe({
      next: () => {
        this.success = 'Deposit completed successfully.';
        this.depositForm.reset({ amount: null, description: '' });
        this.loading = false;

        if (this.accountId) {
          setTimeout(() => {
            this.router.navigate(['/accounts', this.accountId]);
          }, 800);
        }
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to process deposit.';
        this.loading = false;
      },
    });
  }

  get amountInvalid(): boolean {
    const amount = this.depositForm.controls.amount;
    return amount.invalid && (amount.dirty || amount.touched);
  }

  get descriptionInvalid(): boolean {
    const description = this.depositForm.controls.description;
    return description.invalid && (description.dirty || description.touched);
  }
}
