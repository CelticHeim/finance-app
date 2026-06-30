import api from "@/shared/lib/axios";
import type { CreateExpenseData } from "@/shared/types/dtos/expenses.dto"; 

export const createExpense = async (expenseData: CreateExpenseData) => {
    try {
        const { data } = await api.post('/expenses', expenseData);
        return data;
    } catch (error) {
        console.error(error);
    }
};