import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./components/home/home').then(m => m.Home) },
    { path: 'accounts', loadComponent: () => import('./components/all-accounts/all-accounts').then(m => m.AllAccountsComponent) },
    { path: 'accounts/:account/transactions', loadComponent: () => import('./components/all-transactions/all-transactions').then(m => m.AllTransactions) },
    { path: 'accounts/:account/balance', loadComponent: () => import('./components/get-balance/get-balance').then(m => m.GetBalance) },
    { path: 'accounts/:account/convert/fiat', loadComponent: () => import('./components/to-fiat/to-fiat').then(m => m.ToFiat) },
    { path: 'accounts/:account/convert/crypto', loadComponent: () => import('./components/to-crypto/to-crypto').then(m => m.ToCrypto) },
    { path: 'accounts/:account/deposit', loadComponent: () => import('./components/deposit/deposit').then(m => m.Deposit) },
    { path: 'accounts/:account/withdraw', loadComponent: () => import('./components/withdraw/withdraw').then(m => m.Withdraw) },
    { path: 'accounts/:account/transaction/:transactionId', loadComponent: () => import('./components/transaction/transaction').then(m => m.Transaction) },
    { path: 'accounts/:account/edit/:transactionId', loadComponent: () => import('./components/edit-desc/edit-desc').then(m => m.EditDesc) },
    { path: 'accounts/:account/delete/:transactionId', loadComponent: () => import('./components/delete/delete').then(m => m.Delete) },
    { path: 'accounts/:account', loadComponent: () => import('./components/account/account').then(m => m.AccountComponent), pathMatch: 'full' }
];
