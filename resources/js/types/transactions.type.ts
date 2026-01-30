import type { FixedRecord } from "./fixeds.type";
import type { InstallmentRecord } from "./installments.type";
import type { InstallmentItem } from "./installment-items.types";

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
    installment_item?: InstallmentItem;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};