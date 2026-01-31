import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  unsubscribe!: () => void;
  userId = 'USER_ID_HERE'; // replace with actual user ID

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    // Listen to user transactions in real-time
    this.unsubscribe = this.transactionService.listenUserTransactions(
      this.userId,
      (list: Transaction[]) => {
        this.transactions = list; // ✅ explicitly typed
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from real-time listener when component is destroyed
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  // Optional: delete a transaction
  deleteTransaction(id: string): void {
    this.transactionService.deleteTransaction(id);
  }
}
