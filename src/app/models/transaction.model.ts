export interface Transaction {
  id?: string;
  userId: string;
  title: string;
  amount: number;
  category: string;
  date: Date;   // ⚡ changed from string to Date
  type: 'income' | 'expense';
  month?: number;
  year?: number;
}
