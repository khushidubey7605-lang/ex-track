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
import { BehaviorSubject } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private firestore = inject(Firestore);

  private _transactions = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this._transactions.asObservable();

  private unsubscribe: () => void = () => {};

  // Listen to Firestore for a user
  listenUserTransactions(userId: string) {
    this.unsubscribe();
    
    const q = query(
      collection(this.firestore, 'transactions'),
      where('userId', '==', userId)
    );

    this.unsubscribe = onSnapshot(q, snap => {
      const list: Transaction[] = snap.docs.map(d => {
        const data = d.data() as Transaction;

        // ✅ Ensure date is always valid
        let safeDate: Date;
        if (data.date instanceof Date) safeDate = data.date;
        else if (data.date) {
          safeDate = new Date(data.date);
          if (isNaN(safeDate.getTime())) safeDate = new Date();
        } else {
          safeDate = new Date();
        }

        return {
          ...data,
          id: d.id,
          date: safeDate
        };
      });

      // Sort by date descending
      this._transactions.next(list.sort((a, b) => b.date.getTime() - a.date.getTime()));
    });
  }

  // ✅ Add transaction without sending undefined id
  addTransaction(tx: Transaction) {
    const { id, ...data } = tx; // remove id if exists
    return addDoc(collection(this.firestore, 'transactions'), data);
  }

  // Update existing transaction
  updateTransaction(tx: Transaction) {
    if (!tx.id) return Promise.reject('Transaction ID missing');
    const docRef = doc(this.firestore, 'transactions', tx.id);
    const { id, ...data } = tx;
    return updateDoc(docRef, data);
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
