import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';       // ✅ ngModel, ngForm
import { CommonModule } from '@angular/common';     // ✅ *ngFor, *ngIf

import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-income',
  standalone: true,          // ✅ make it standalone
  imports: [FormsModule, CommonModule],  // ✅ modules for template
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class IncomeComponent implements OnInit, OnDestroy {

  transactions: Transaction[] = [];
  data: Transaction = {
    title: '',
    amount: 0,
    category: '',
    date: '',
    userId: '',
    type: 'income'
  };
  unsubscribe!: () => void;
  userId = 'USER_ID_HERE'; // replace with actual user ID

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    // Real-time listener for user's income
    this.unsubscribe = this.transactionService.listenUserTransactions(
      this.userId,
      (list: Transaction[]) => {
        this.transactions = list.filter(t => t.type === 'income');
      }
    );
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) this.unsubscribe();
  }

  save(): void {
    const transaction: Transaction = { ...this.data, userId: this.userId, type: 'income' };
    this.transactionService.addTransaction(transaction);

    // Reset form
    this.data = {
      title: '',
      amount: 0,
      category: '',
      date: '',
      userId: '',
      type: 'income'
    };
  }

  editIncome(item: Transaction): void {
    this.data = { ...item };
  }

  deleteIncome(item: Transaction): void {
    if (item.id) this.transactionService.deleteTransaction(item.id);
  }
}
