import api from "@/lib/axios";

type FinanceRecord = {
    id: number;
    amount: string;
    category: string;
    description: string | null;
    transaction_date: string;
    type: 'income' | 'expense';
    created_at: string;
};

type PaginatedResponse<T> = {
    message: string;
    data: {
        current_page: number;
        data: T[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: Array<{
            url: string | null;
            label: string;
            page: number | null;
            active: boolean;
        }>;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
};

type FinanceResponse = PaginatedResponse<FinanceRecord>;

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

type SummaryResponse = {
    message: string;
    data: {
        available_balance: number;
        total_debt: number;
        current_month_income: number;
        current_month_debt: number;
    };
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

type DebtsResponse = {
    message: string;
    data: {
        fixeds: Array<{
            id: number;
            amount: string;
            category: string;
            description: string | null;
            day_of_month: number;
            created_at: string;
        }>;
        installments: Array<{
            id: number;
            amount: string;
            number_of_installments: number;
            current_installment: number;
            due_date: string;
            status: 'pending' | 'paid' | 'overdue';
            created_at: string;
        }>;
    };
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