import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TransactionService } from '../../../services/transaction.service';
import { AuthService, CurrentUser } from '../../../services/auth.service';
import { Transaction } from '../../../models/transaction.model';

@Component({
  selector: 'app-expenses',
  standalone: true,
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ExpensesComponent implements OnInit, OnDestroy {
  userId!: string;
  expenses: Transaction[] = [];
  editingId: string | null = null;
  data = this.getEmptyData();

  private authSub!: Subscription;
  private txSub!: Subscription;

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    this.authSub = this.authService.userChanges.subscribe((user: CurrentUser | null) => {
      if (!user) return;

      this.userId = user.uid;
      this.transactionService.listenUserTransactions(this.userId);

      this.txSub = this.transactionService.transactions$.subscribe(list => {
        this.expenses = list
          .filter(t => t.type === 'expense')
          .map(t => ({
            ...t,
            date: t.date instanceof Date ? t.date : new Date(t.date) // ensure Date object
          }))
          .sort((a, b) => b.date.getTime() - a.date.getTime());
      });
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
    this.txSub?.unsubscribe();
    this.transactionService.stopListening();
  }

  // ✅ Ensure date string for <input type="date">
  getEmptyData() {
    const today = new Date();
    return {
      title: '',
      amount: 0,
      category: '',
      date: today.toISOString().split('T')[0]
    };
  }

  save(form: NgForm) {
    if (form.invalid || !this.userId) return;

    const tx: Transaction = {
      ...this.data,
      amount: Number(this.data.amount),
      date: new Date(this.data.date),
      month: new Date(this.data.date).getMonth() + 1,
      year: new Date(this.data.date).getFullYear(),
      userId: this.userId,
      type: 'expense'
    };

    const action = this.editingId
      ? this.transactionService.updateTransaction({ ...tx, id: this.editingId })
      : this.transactionService.addTransaction(tx);

    action
      .then(() => {
        form.resetForm();
        this.editingId = null;
        this.data = this.getEmptyData();
      })
      .catch(err => console.error('Transaction save failed:', err));
  }

  edit(item: Transaction) {
    this.editingId = item.id!;

    // ✅ Safe date conversion for editing
    let safeDate: string;
    if (item.date instanceof Date) safeDate = item.date.toISOString().split('T')[0];
    else if (item.date) {
      const d = new Date(item.date);
      safeDate = isNaN(d.getTime()) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0];
    } else {
      safeDate = new Date().toISOString().split('T')[0];
    }

    this.data = {
      title: item.title,
      amount: item.amount,
      category: item.category,
      date: safeDate
    };
  }

  cancelEdit() {
    this.editingId = null;
    this.data = this.getEmptyData();
  }

  delete(id: string) {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    this.transactionService.deleteTransaction(id)
      .then(() => {
        if (this.editingId === id) this.cancelEdit();
      })
      .catch(err => console.error('Delete failed:', err));
  }
}
