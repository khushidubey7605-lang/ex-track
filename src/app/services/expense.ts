import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, query, where, onSnapshot } from '@angular/fire/firestore';

export interface Expense {
  id?: string;
  title: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  month: number;
  year: number;
  userId: string;
  type?: string;
}

@Injectable({ providedIn: 'root' })
export class ExpenseService {

  constructor(private firestore: Firestore) {}

  // ---------------- Real-time listener ----------------
  // Returns an unsubscribe function
  listenExpenses(userId: string, callback: (list: Expense[]) => void): () => void {
    const q = query(collection(this.firestore, 'expenses'), where('userId', '==', userId));
    
    const unsubscribe = onSnapshot(q, snapshot => {
      const list: Expense[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Expense));
      callback(list);
    });

    return unsubscribe;
  }

  // ---------------- Add expense ----------------
  async addExpense(expense: Expense) {
    try {
      await addDoc(collection(this.firestore, 'expenses'), expense);
    } catch (err) {
      console.error('Add expense error:', err);
      throw err;
    }
  }

  // ---------------- Update expense ----------------
  async updateExpense(id: string, expense: Expense) {
    try {
      const docRef = doc(this.firestore, 'expenses', id);
      const { id: _, ...updateData } = expense;
      await updateDoc(docRef, updateData);
    } catch (err) {
      console.error('Update expense error:', err);
      throw err;
    }
  }

  // ---------------- Delete expense ----------------
  async deleteExpense(id: string) {
    try {
      const docRef = doc(this.firestore, 'expenses', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Delete expense error:', err);
      throw err;
    }
  }
}
