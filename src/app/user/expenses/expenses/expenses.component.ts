import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExpenseService, Expense } from '../../../services/expense';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {

  // Form data
  data: { title: string; amount: number | null; category: string; date: string } = {
    title: '',
    amount: null,
    category: '',
    date: ''
  };

  expenses: Expense[] = [];
  loading = true;

  constructor(private service: ExpenseService, private auth: AuthService) {}

  ngOnInit() {
    this.loadUserExpenses();
  }

  // Wait for auth user then load expenses
  async loadUserExpenses() {
    let user = this.auth.getCurrentUser();
    while (!user) {
      await new Promise(r => setTimeout(r, 300));
      user = this.auth.getCurrentUser();
    }
    await this.loadExpenses();
    this.loading = false;
  }

  // Load all expenses from Firestore
  async loadExpenses() {
    this.expenses = await this.service.getAllExpenses();

    // Ensure date is formatted YYYY-MM-DD
    this.expenses = this.expenses.map(e => ({
      ...e,
      date: e.date ? new Date(e.date).toISOString().split('T')[0] : ''
    }));

    console.log('Loaded expenses:', this.expenses);
  }

  // Save new expense
  async save() {
    if (!this.data.title || !this.data.amount || !this.data.date) {
      alert('Please fill all fields');
      return;
    }

    const uid = this.auth.getCurrentUser()?.uid;
    if (!uid) { alert('User not logged in'); return; }

    const d = new Date(this.data.date);

    const newExpense: Expense = {
      ...this.data,
      amount: Number(this.data.amount),
      type: 'expense',
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      userId: uid,
      date: d.toISOString().split('T')[0]  // ✅ format YYYY-MM-DD
    };

    try {
      const docRef = await this.service.addTransaction(newExpense);

      // Show instantly
      this.expenses.unshift({ ...newExpense, id: docRef.id });

      alert('Expense Added');

      // Reset form
      this.data = { title: '', amount: null, category: '', date: '' };

    } catch (err) {
      console.error('Error adding expense:', err);
      alert('Failed to add expense.');
    }
  }
}
