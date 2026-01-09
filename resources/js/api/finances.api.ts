import api from "@/lib/axios";
import type { FinanceResponse, SummaryResponse, DebtsResponse } from "@/types/finances.types";

export const getFinances = async (
    page: number = 1,
    limit: number = 10,
    month?: number,
    year?: number
): Promise<FinanceResponse | undefined> => {
    try {
        const { data } = await api.get('/finances', {
            params: {
                page,
                limit,
                ...(month && { month }),
                ...(year && { year }),
            },
        });
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const getSummary = async (
    month?: number,
    year?: number
): Promise<SummaryResponse | undefined> => {
    try {
        const { data } = await api.get('/finances/summary', {
            params: {
                ...(month && { month }),
                ...(year && { year }),
            },
        });
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const getDebts = async (
    month?: number,
    year?: number
): Promise<DebtsResponse | undefined> => {
    try {
        const { data } = await api.get('/finances/debts', {
            params: {
                ...(month && { month }),
                ...(year && { year }),
            },
        });
        return data;
    } catch (error) {
        console.error(error);
    }
};