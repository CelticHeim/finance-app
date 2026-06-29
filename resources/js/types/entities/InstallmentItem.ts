import type { Installment } from './Installment';
import type { Transaction } from './Transaction';

export interface InstallmentItem {
  id: number;
  amount: string;
  payment_date: string;
  paid_at: string | null;
  status: string;
  installment_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  installment?: Installment;
  transaction?: Transaction;
}
