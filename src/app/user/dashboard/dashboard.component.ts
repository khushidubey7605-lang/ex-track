import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIf, NgFor, DatePipe, NgClass, CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { TransactionService } from '../../services/transaction.service';
import { AuthService, CurrentUser } from '../../services/auth.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, NgIf, NgFor, DatePipe, NgClass] // ✅ important for standalone
})
export class DashboardComponent implements OnInit, OnDestroy {
  userId!: string;
  transactions: Transaction[] = [];
  totalIncome: number = 0;
  totalExpense: number = 0;

  private authSub!: Subscription;
  private txSub!: Subscription;

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.authSub = this.authService.userChanges.subscribe((user: CurrentUser | null) => {
      if (!user) return;

      this.userId = user.uid;
      this.transactionService.listenUserTransactions(this.userId);

      this.txSub = this.transactionService.transactions$.subscribe((list: Transaction[]) => {
        this.transactions = list
          .map(tx => ({
            ...tx,
            date: tx.date && (tx.date as any).toDate ? (tx.date as any).toDate() : new Date(tx.date)
          }))
          .sort((a, b) => b.date.getTime() - a.date.getTime());

        this.totalIncome = this.transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);

        this.totalExpense = this.transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
      });
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.txSub?.unsubscribe();
    this.transactionService.stopListening();
  }
}
