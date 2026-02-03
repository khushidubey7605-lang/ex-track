import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private firestore = inject(Firestore);

  // Real-time store of all transactions
  private _transactions = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this._transactions.asObservable();

  private unsubscribe: () => void = () => {};

  // Listen to Firestore for a user
  listenUserTransactions(userId: string) {
    // Unsubscribe previous listener if exists
    this.unsubscribe();
    
    const q = query(
      collection(this.firestore, 'transactions'),
      where('userId', '==', userId)
    );

    this.unsubscribe = onSnapshot(q, snap => {
      const list: Transaction[] = snap.docs.map(d => {
        const data = d.data() as Transaction;
        return {
          ...data,
          id: d.id,
          date: data.date instanceof Date ? data.date : new Date(data.date)
        };
      });

      // Sort by date descending
      this._transactions.next(list.sort((a, b) => b.date.getTime() - a.date.getTime()));
    });
  }

  // Add new transaction
  addTransaction(tx: Transaction) {
    return addDoc(collection(this.firestore, 'transactions'), tx);
  }

  // Update existing transaction
  updateTransaction(tx: Transaction) {
    if (!tx.id) return Promise.reject('Transaction ID missing');
    const docRef = doc(this.firestore, 'transactions', tx.id);
    return updateDoc(docRef, {
      title: tx.title,
      amount: tx.amount,
      category: tx.category,
      date: tx.date,
      month: tx.month,
      year: tx.year,
      type: tx.type
    });
  }

  // Delete transaction
  deleteTransaction(id: string) {
    return deleteDoc(doc(this.firestore, 'transactions', id));
  }

  // Cleanup listener
  stopListening() {
    this.unsubscribe();
  }
}
