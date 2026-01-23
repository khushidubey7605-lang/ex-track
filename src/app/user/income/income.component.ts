import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IncomeService } from '../../services/income.service';


@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class IncomeComponent {

  // Form model
  data = {
    title: '',
    amount: 0,
    category: '',
    date: ''
  };

  // List of incomes
  incomeList: any[] = [];

  constructor(private service: IncomeService) {
    this.loadIncomes();
  }

  // Save new income
  async save() {
    const d = new Date(this.data.date);
    await this.service.addIncome({
      ...this.data,
      month: d.getMonth() + 1,
      year: d.getFullYear()
    });

    alert('Income Added');
    this.data = { title: '', amount: 0, category: '', date: '' }; // reset form
    this.loadIncomes(); // reload list
  }

  // Load all incomes
  async loadIncomes() {
    this.incomeList = await this.service.getIncomes(); // Make sure getIncomes() returns Promise<any[]>
  }

  // Edit an income
  editIncome(item: any) {
    this.data = { ...item }; // load item into form for editing
  }

  // Delete an income
  async deleteIncome(item: any) {
    await this.service.deleteIncome(item.id); // Make sure deleteIncome accepts ID
    alert('Income Deleted');
    this.loadIncomes(); // refresh list
  }
}
