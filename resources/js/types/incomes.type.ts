export type CreateIncomeData = {
    amount: number | string;
    description: string;
    // discount: number;
    transaction_date: string;
    category: string;
};

export type IncomeRecord = {
    id: number;
    amount: string;
    category: string;
    description: string | null;
    entry_date: string;
    created_at: string;
    updated_at: string;
};
