import api from "@/lib/axios";

type CreateFixedData = {
    amount: number;
    category: string;
    description?: string;
    day_of_month: number;
};

export const createFixed = async (data: CreateFixedData) => {
    try {
        const response = await api.post('/fixeds', data);
        return response.data;
    } catch (error) {
        console.error('Error creating fixed expense:', error);
        throw error;
    }
};
