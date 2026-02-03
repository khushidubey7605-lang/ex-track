import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType, ChartOptions } from 'chart.js';
import { Subscription } from 'rxjs';

import { TransactionService } from '../../services/transaction.service';
import { AuthService, CurrentUser } from '../../services/auth.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  userId!: string;
  transactions: Transaction[] = [];

  totalIncome = 0;
  totalExpense = 0;
  balance = 0;

  // Pie chart
  pieChartType: ChartType = 'pie';
  pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' } }
  };
  pieChartData: ChartData<'pie', number[], string> = {
    labels: ['Income', 'Expense'],
    datasets: [
      { data: [0, 0], backgroundColor: ['#4ade80', '#f87171'] }
    ]
  };

  private authSub!: Subscription;
  private txSub!: Subscription;

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    // Listen for user login
    this.authSub = this.authService.userChanges.subscribe((user: CurrentUser | null) => {
      if (!user) return;

      this.userId = user.uid;

      // Subscribe to user's transactions
      this.txSub = this.transactionService.listenUserTransactions(this.userId)
        .subscribe((list: Transaction[]) => {
          this.transactions = list;
          this.calculateTotals();
        });
    });
  }

  calculateTotals(): void {
    this.totalIncome = this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    this.totalExpense = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    this.balance = this.totalIncome - this.totalExpense;

    // Update pie chart
    this.pieChartData.datasets[0].data[0] = this.totalIncome;
    this.pieChartData.datasets[0].data[1] = this.totalExpense;

    this.chart?.update();
  }

  ngOnDestroy(): void {
    if (this.authSub) this.authSub.unsubscribe();
    if (this.txSub) this.txSub.unsubscribe();
  }
}
