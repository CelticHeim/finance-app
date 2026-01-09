import { PaginatedResponse } from "./common.type";
import { TransactionRecord } from "./transactions.type";

export type FinanceResponse = PaginatedResponse<TransactionRecord>;

export type SummaryResponse = {
    message: string;
    data: {
        available_balance: number;
        total_debt: number;
        current_month_income: number;
        current_month_debt: number;
    };
};

export type DebtsResponse = {
    message: string;
    data: {
        fixeds: Array<{
            id: number;
            amount: string;
            category: string;
            description: string | null;
            due_date: string;
            created_at: string;
        }>;
        installments: Array<{
            id: number;
            amount: string;
            number_of_installments: number;
            current_installment: number;
            due_date: string;
            status: 'pending' | 'paid' | 'overdue';
            created_at: string;
        }>;
    };
};
