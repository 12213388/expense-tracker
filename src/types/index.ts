export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string; // ISO format: '2025-03-01'
}
 
export interface Category {
  name: string;
  icon: string;
  color: string;
}
