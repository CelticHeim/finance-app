import api from "@/lib/axios";
import type { CreateExpenseData } from "@/types/expenses.type";

export const createExpense = async (expenseData: CreateExpenseData) => {
    try {
        const { data } = await api.post('/expenses', expenseData);
        return data;
    } catch (error) {
        console.error(error);
    }
};