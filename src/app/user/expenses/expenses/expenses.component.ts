import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService, Expense } from '../../../services/expense';
import { AuthService } from '../../../services/auth';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit, OnDestroy {

  data = { title: '', amount: null as any, category: '', date: '' };
  expenses: Expense[] = [];
  editingId: string | null = null;

  private unsubscribeSnapshot: (() => void) | null = null;

  constructor(
    private service: ExpenseService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    // Listen to auth changes (login/logout)
    this.auth.userChanges.subscribe(user => {
      if (this.unsubscribeSnapshot) {
        // detach previous listener if any
        this.unsubscribeSnapshot();
      }
      if (user) {
        this.unsubscribeSnapshot = this.service.listenExpenses(user.uid, list => {
          this.expenses = list;
        });
      } else {
        // no user logged in
        this.expenses = [];
      }
    });
  }

  ngOnDestroy() {
    if (this.unsubscribeSnapshot) {
      this.unsubscribeSnapshot();
    }
  }

  edit(e: Expense) {
    this.editingId = e.id!;
    this.data = {
      title: e.title,
      amount: e.amount,
      category: e.category,
      date: e.date
    };
  }

  async delete(id: string) {
    if (!confirm('Delete this expense?')) return;
    try {
      await this.service.deleteExpense(id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete expense');
    }
  }

  async save() {
    if (!this.data.title || !this.data.amount || !this.data.date || !this.data.category) {
      alert('Fill all fields');
      return;
    }

    const user = this.auth.getCurrentUser();
    if (!user) return;

    const d = new Date(this.data.date);

    const payload: Expense = {
      title: this.data.title,
      amount: Number(this.data.amount),
      category: this.data.category,
      date: d.toISOString().split('T')[0],
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      userId: user.uid
    };

    try {
      if (this.editingId) {
        await this.service.updateExpense(this.editingId, payload);
        this.editingId = null;
      } else {
        await this.service.addExpense(payload);
      }
      this.data = { title: '', amount: null, category: '', date: '' };
    } catch (err) {
      console.error(err);
      alert('Failed to save expense');
    }
  }
}
