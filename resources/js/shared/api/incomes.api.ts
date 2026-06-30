import api from "@/shared/lib/axios";
import type { CreateIncomeData } from "@/shared/types/dtos/incomes.dto";

export const createIncome = async (incomeData: CreateIncomeData) => {
    try {
        const { data } = await api.post('/incomes', incomeData);
        return data;
    } catch (error) {
        console.error(error);
    }
};