import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private firestore = inject(Firestore);

  // Listen to user's transactions as Observable
  listenUserTransactions(userId: string): Observable<Transaction[]> {
    return new Observable<Transaction[]>(observer => {
      const q = query(
        collection(this.firestore, 'transactions'),
        where('userId', '==', userId)
      );

      const unsubscribe = onSnapshot(q, (snap) => {
        const list: Transaction[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Transaction)
        }));
        observer.next(list);
      });

      // Cleanup on unsubscribe
      return () => unsubscribe();
    });
  }

  addTransaction(data: Transaction): Promise<any> {
    return addDoc(collection(this.firestore, 'transactions'), data);
  }

  deleteTransaction(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'transactions', id));
  }
}
