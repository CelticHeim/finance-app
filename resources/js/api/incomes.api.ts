import api from "@/lib/axios";

export const createIncome = async (incomeData: {
    amount: number;
    category: string;
    description?: string;
    entry_date: string;
}) => {
    try {
        const { data } = await api.post('/incomes', incomeData);
        return data;
    } catch (error) {
        console.error(error);
    }
};