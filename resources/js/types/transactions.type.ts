import type { FixedRecord } from "./fixeds.type";
import type { InstallmentRecord } from "./installments.type";

export type TransactionRecord = {
    id: number;
    amount: string;
    description: string | null;
    discount: string;
    transaction_date: string;
    category: string;
    type: 'income' | 'expense' | 'fixed' | 'installment';
    status: string;
    transactionable_type: string;
    transactionable_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    transactionable: FixedRecord | InstallmentRecord | null;
};