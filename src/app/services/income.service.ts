import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  private incomes: any[] = []; // Temporary storage

  constructor() { }

  // Add new income
  addIncome(data: any): Promise<any> {
    data.id = new Date().getTime().toString(); // simple unique ID
    this.incomes.push(data);
    return Promise.resolve(data);
  }

  // Get all incomes
  getIncomes(): Promise<any[]> {
    return Promise.resolve(this.incomes);
  }

  // Delete an income by id
  deleteIncome(id: string): Promise<void> {
    this.incomes = this.incomes.filter(item => item.id !== id);
    return Promise.resolve();
  }
}
