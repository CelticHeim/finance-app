import api from "@/lib/axios";
import type { 
    FinanceIndexResponse, 
    TransactionsResponse, 
    SummaryResponse, 
    FixedsResponse,
    InstallmentsResponse
} from "@/types/finances.types";

// Obtiene el resumen completo del mes actual (transacciones, resumen, fixeds, installments)
export const getFinances = async (): Promise<FinanceIndexResponse | undefined> => {
    try {
        const { data } = await api.get('/finances');
        return data;
    } catch (error) {
        console.error(error);
    }
};

// Obtiene transacciones paginadas con filtros
export const getTransactions = async (
    page: number = 1,
    limit: number = 10,
    filters?: { month?: number; year?: number; types?: string }
): Promise<TransactionsResponse | undefined> => {
    try {
        const { data } = await api.get('/finances/transactions', {
            params: {
                page,
                limit,
                ...(filters?.month && { month: filters.month }),
                ...(filters?.year && { year: filters.year }),
                ...(filters?.types && { types: filters.types }),
            },
        });
        return data;
    } catch (error) {
        console.error(error);
    }
};

// Obtiene el resumen financiero del mes
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

// Obtiene los gastos fijos
export const getFixeds = async (): Promise<FixedsResponse | undefined> => {
    try {
        const { data } = await api.get('/finances/fixeds');
        return data;
    } catch (error) {
        console.error(error);
    }
};

// Obtiene las cuotas pendientes
export const getInstallments = async (): Promise<InstallmentsResponse | undefined> => {
    try {
        const { data } = await api.get('/finances/installments');
        return data;
    } catch (error) {
        console.error(error);
    }
};
