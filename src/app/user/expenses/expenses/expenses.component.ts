import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../../services/expense';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {

  data = {
    title: '',
    amount: 0,
    category: '',
    date: ''
  };

  expenses: any[] = [];

  constructor(
    private service: ExpenseService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.loadExpenses();
  }

  async loadExpenses() {
    this.expenses = await this.service.getAllExpenses();
  }

  async save() {

    if (!this.data.title || !this.data.amount || !this.data.date) {
      alert('Please fill all fields');
      return;
    }

    const d = new Date(this.data.date);
    const uid = this.auth.getCurrentUser()?.uid;

    if (!uid) {
      alert('User not logged in');
      return;
    }

    await this.service.addTransaction({
      ...this.data,
      type: 'expense',
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      uid: uid
    });

    alert('Expense Added');

    this.data = { title: '', amount: 0, category: '', date: '' };
    this.loadExpenses();
  }
}
