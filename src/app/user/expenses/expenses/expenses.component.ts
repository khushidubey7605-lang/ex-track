import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../../services/expense';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expenses.component.html'
})
export class ExpensesComponent {

  data = {
    title: '',
    amount: 0,
    category: '',
    date: ''
  };

  constructor(private service: ExpenseService) {}

  async save() {
    const d = new Date(this.data.date);
    await this.service.addTransaction({
      ...this.data,
      type: 'expense',
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      uid: '',
    });
    alert('Expense Added');
  }
}
