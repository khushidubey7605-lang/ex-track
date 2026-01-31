import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TransactionService } from '../../services/transaction.service';
import { AuthService, CurrentUser } from '../../services/auth.service';
import { Transaction } from '../../models/transaction.model';


@Component({
  selector: 'app-income',
  standalone: true,
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css'],
  imports: [CommonModule, FormsModule]
})
export class IncomeComponent implements OnInit, OnDestroy {

  userId!: string;
  income: Transaction[] = [];
  editingId: string | null = null;

  data = {
    title: '',
    amount: 0,
    category: '',
    date: ''
  };

  private authSub!: Subscription;
  private txUnsub!: () => void;

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    // ✅ Listen logged-in user
    this.authSub = this.authService.userChanges.subscribe(
      (user: CurrentUser | null) => {
        if (!user) return;

        this.userId = user.uid;

        // ✅ Start Firestore listener after UID
        this.txUnsub = this.transactionService.listenUserTransactions(
          this.userId,
          list => {
            this.income = list.filter(t => t.type === 'income');
          }
        );
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSub) this.authSub.unsubscribe();
    if (this.txUnsub) this.txUnsub();
  }

  save(form: any): void {
    if (form.invalid) return;

    const dateObj = new Date(this.data.date);

    const tx: Transaction = {
      title: this.data.title,
      amount: Number(this.data.amount),
      category: this.data.category,
      date: this.data.date,
      month: dateObj.getMonth() + 1,
      year: dateObj.getFullYear(),
      userId: this.userId,
      type: 'income'
    };

    this.transactionService.addTransaction(tx).then(() => {
      form.resetForm();
      this.editingId = null;
    });
  }

  edit(item: Transaction): void {
    this.editingId = item.id!;
    this.data = {
      title: item.title,
      amount: item.amount,
      category: item.category,
      date: item.date
    };
  }

  delete(id: string): void {
    this.transactionService.deleteTransaction(id);
  }
}
