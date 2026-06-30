import type { Expense } from "../entities/Expense";
import type { PaginatedResponse } from "./common.dto";

export type CreateExpenseData = {
    amount: number | string;
    description: string;
    transaction_date: string;
    category: string;
};

export type ExpenseFormData = {
    amount: number | string;
    description: string;
    transaction_date: string;
    category: string;
    expenseType: 'expense' | 'fixed' | 'installment';
    number_of_installments?: number;
    payment_day?: number;
};

export type PaginatedExpenseResponse = PaginatedResponse<Expense>;
