import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

export interface Expense {
  id?: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  month: number;
  year: number;
  userId: string;
  type?: string;
}

@Injectable({ providedIn: 'root' })
export class ExpenseService {

  constructor(private firestore: Firestore, private auth: AuthService) {}

  async addTransaction(data: Expense) {
    const ref = collection(this.firestore, 'expenses');
    return await addDoc(ref, data);
  }

  async getAllExpenses(): Promise<Expense[]> {
    const uid = this.auth.getCurrentUser()?.uid;
    if (!uid) return [];

    const ref = collection(this.firestore, 'expenses');
    const q = query(ref, where('userId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Expense) }));
  }
}
    