import type { Transaction } from "./Transaction"; 

export interface Fixed {
    id: number;
    amount: string;
    category: string;
    description: string;
    due_date: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    
    transactions?: Transaction[];
}
