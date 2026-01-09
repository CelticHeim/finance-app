export type CreateFixedData = {
    amount: number;
    category: string;
    description?: string;
    due_date: string;
};

export type FixedRecord = {
    id: number;
    amount: string;
    description: string;
    category: string;
    due_date: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};
