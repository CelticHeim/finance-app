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

export type ExpenseRecord = {
    id: number;
    amount: string;
    category: string;
    description: string | null;
    expense_date: string;
    discount: string;
    created_at: string;
    updated_at: string;
};
