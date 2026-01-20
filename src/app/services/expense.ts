import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class ExpenseService {

  constructor(
    private firestore: Firestore,
    private auth: AuthService
  ) {}

  async addTransaction(data: Transaction) {
    const ref = collection(this.firestore, 'transactions');
    return await addDoc(ref, data);
  }

  async getByMonthYear(type: 'income' | 'expense', month: number, year: number) {
    const uid = this.auth.getCurrentUser()?.uid!;
    const ref = collection(this.firestore, 'transactions');

    const q = query(
      ref,
      where('uid', '==', uid),
      where('type', '==', type),
      where('month', '==', month),
      where('year', '==', year)
    );

    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}
