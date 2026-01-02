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

type FinanceResponse = {
    message: string;
    data: FinanceRecord[];
    pagination: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
        from: number;
        to: number;
    };
};

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