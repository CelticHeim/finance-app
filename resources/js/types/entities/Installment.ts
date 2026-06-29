import type { InstallmentItem } from './InstallmentItem';

export interface Installment {
  id: number;
  amount: string;
  description: string;
  category: string;
  due_date: string;
  number_of_installments: number;
  current_installment: number;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  items?: InstallmentItem[];
}
