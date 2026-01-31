// src/app/services/transaction.service.ts
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  DocumentData
} from '@angular/fire/firestore';
import { Transaction } from '../models/transaction.model'; // ✅ make sure this file exists

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private firestore: Firestore) {}

  // Add a new transaction
  addTransaction(data: Transaction) {
    return addDoc(
      collection(this.firestore, 'transactions'),
      data as DocumentData
    );
  }

  // Listen to transactions of a specific user in real-time
  listenUserTransactions(
    userId: string,
    cb: (list: Transaction[]) => void
  ): () => void {

    const q = query(
      collection(this.firestore, 'transactions'),
      where('userId', '==', userId)
    );

    return onSnapshot(q, snap => {
      const list: Transaction[] = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Transaction)
      }));
      cb(list);
    });
  }

  // Delete a transaction by ID
  deleteTransaction(id: string) {
    return deleteDoc(doc(this.firestore, 'transactions', id));
  }
}
