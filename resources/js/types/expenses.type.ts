export type CreateExpenseData = {
    amount: number;
    description: string;
    transaction_date: string;
    category: string;
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
