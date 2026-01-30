import type { InstallmentItem } from "./installment-items.types";

export type CreateInstallmentData = {
    amount: number;
    description: string;
    category: string;
    number_of_installments: number;
    due_date: string;
};

export type InstallmentRecord = {
    id: number;
    amount: string;
    description: string | null;
    category: string;
    due_date: string;
    number_of_installments: number;
    current_installment: number;
    status: 'pending' | 'completed' | 'overdue';
    items?: InstallmentItem[];
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};
