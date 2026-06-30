import type { Installment } from './Installment';

export interface Expense {
  id: number;
  amount: string;
  discount: string;
  category: string;
  description: string;
  expense_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  
  installments?: Installment[];
}
