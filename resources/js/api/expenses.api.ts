import api from "@/lib/axios";

export const createExpense = async (expenseData: {
    amount: number;
    category: string;
    description?: string;
    expense_date: string;
    is_fixed?: boolean;
    is_installment?: boolean;
    total_installments?: number;
    due_day?: number;
}) => {
    try {
        const { data } = await api.post('/expenses', expenseData);
        return data;
    } catch (error) {
        console.error(error);
    }
};