export interface Transaction {
  id?: string;
  title: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
  month: number;
  year: number;
  uid: string;
  createdAt?: any;
}
