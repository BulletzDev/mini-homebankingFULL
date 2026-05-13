import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account.html',
  styleUrls: ['./account.css']
})
export class AccountComponent implements OnInit {
  private route = inject(ActivatedRoute);
  
  // Signals per lo stato del componente
  accountDetails = signal<any>(null);
  transactions = signal<any[]>([]);
  loading = signal<boolean>(true);

  ngOnInit() {
    // Legge l'ID dall'URL
    const accountId = this.route.snapshot.paramMap.get('account');
    if (accountId) {
      this.loadAccountData(accountId);
    }
  }

  loadAccountData(id: string) {
    
  }
}
