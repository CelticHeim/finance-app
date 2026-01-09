import api from "@/lib/axios";
import type { CreateIncomeData } from "@/types/incomes.type";

export const createIncome = async (incomeData: CreateIncomeData) => {
    try {
        const { data } = await api.post('/incomes', incomeData);
        return data;
    } catch (error) {
        console.error(error);
    }
};