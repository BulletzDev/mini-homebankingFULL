import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { AllAccountsComponent } from './components/all-accounts/all-accounts';
import { Delete } from './components/delete/delete';
import { Deposit } from './components/deposit/deposit';
import { EditDesc } from './components/edit-desc/edit-desc';
import { GetBalance } from './components/get-balance/get-balance';
import { ToCrypto } from './components/to-crypto/to-crypto';
import { ToFiat } from './components/to-fiat/to-fiat';
import { Transaction } from './components/transaction/transaction';
import { Withdraw } from './components/withdraw/withdraw';
import { AllTransactions } from './components/all-transactions/all-transactions';
import { AccountComponent } from './components/account/account';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'accounts', component: AllAccountsComponent },
    { path: 'accounts/:account/transactions', component: AllTransactions },
    { path: 'accounts/:account/balance', component: GetBalance },
    { path: 'accounts/:account/convert/fiat', component: ToFiat },
    { path: 'accounts/:account/convert/crypto', component: ToCrypto },
    { path: 'accounts/:account/deposit', component: Deposit },
    { path: 'accounts/:account/withdraw', component: Withdraw },
    { path: 'accounts/:account/transaction/:transactionId', component: Transaction },
    { path: 'accounts/:account/edit/:transactionId', component: EditDesc },
    { path: 'accounts/:account/delete/:transactionId', component: Delete },
    { path: 'accounts/:account', component: AccountComponent, pathMatch: 'full' }
];
