import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  // Get all accounts
  getAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/accounts`);
  }

  // Get account details
  getAccountDetails(accountId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/accounts/${accountId}`);
  }

  // Get transactions for an account
  getTransactions(accountId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/accounts/${accountId}/transactions`);
  }

  // Get a specific transaction
  getTransaction(accountId: number, transactionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/accounts/${accountId}/transactions/${transactionId}`);
  }

  // Deposit money
  deposit(accountId: number, amount: number, description: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/accounts/${accountId}/deposit`, { amount, description });
  }

  // Withdraw money
  withdraw(accountId: number, amount: number, description: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/accounts/${accountId}/withdrawal`, { amount, description });
  }

  // Update transaction description
  updateTransaction(accountId: number, transactionId: number, description: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/accounts/${accountId}/transactions/${transactionId}`, { description });
  }

  // Delete transaction
  deleteTransaction(accountId: number, transactionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/accounts/${accountId}/transactions/${transactionId}`);
  }

  // Get account balance
  getBalance(accountId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/accounts/${accountId}/balance`);
  }

  // Convert balance to fiat
  convertToFiat(accountId: number, to: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/accounts/${accountId}/balance/convert/fiat`, { params: { to } });
  }

  // Convert balance to crypto
  convertToCrypto(accountId: number, to: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/accounts/${accountId}/balance/convert/crypto`, { params: { to } });
  }
}