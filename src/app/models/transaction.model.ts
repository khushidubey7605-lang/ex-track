export interface Transaction {
  id?: string;       // optional, Firestore auto-generates
  userId: string;
  title: string;
  amount: number;
  category: string;
  date: string;      // ISO string or Firestore timestamp
  type: 'income' | 'expense';
  month?: number;    // optional, calculated
  year?: number;     // optional, calculated
}
