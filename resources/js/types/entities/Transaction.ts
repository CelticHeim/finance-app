import type { Fixed } from './Fixed';
import type { InstallmentItem } from './InstallmentItem';

export interface Transaction {
    id: number;
    amount: string;
    description: string;
    discount: string;
    transaction_date: string;
    category: string;
    type: string;
    status: string;
    transactionable_id: number;
    transactionable_type: string;
    created_at: string;
    updated_at: string;
    transactionable?: Fixed | InstallmentItem;
    installmentItem?: InstallmentItem;
}
