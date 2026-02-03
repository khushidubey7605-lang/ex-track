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

      // Start listening to transactions
      this.transactionService.listenUserTransactions(this.userId);

      // Subscribe to BehaviorSubject
      this.txSub = this.transactionService.transactions$.subscribe(list => {
        this.expenses = list.filter(t => t.type === 'expense');

        // Reset form if not editing
        if (!this.editingId) this.data = this.getEmptyData();
      });
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
    this.txSub?.unsubscribe();
    this.transactionService.stopListening();
  }

  getEmptyData() {
    return { title: '', amount: 0, category: '', date: new Date() };
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
      type: 'expense',
      id: this.editingId ?? undefined
    };

    const action = this.editingId
      ? this.transactionService.updateTransaction(tx)
      : this.transactionService.addTransaction(tx);

    action.then(() => {
      form.resetForm();
      this.editingId = null;
      this.data = this.getEmptyData();
    });
  }

  edit(item: Transaction) {
    this.editingId = item.id!;
    this.data = { title: item.title, amount: item.amount, category: item.category, date: new Date(item.date) };
  }

  cancelEdit() {
    this.editingId = null;
    this.data = this.getEmptyData();
  }

  delete(id: string) {
    this.transactionService.deleteTransaction(id);
  }
}
