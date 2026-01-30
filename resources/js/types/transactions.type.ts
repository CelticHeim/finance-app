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
    installment_item_id?: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};