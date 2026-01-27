import api from "@/lib/axios";
import type { CreateFixedData } from "@/types/fixeds.type";

export const createFixed = async (data: CreateFixedData) => {
    try {
        const response = await api.post('/fixeds', data);
        return response.data;
    } catch (error) {
        console.error('Error creating fixed expense:', error);
    }
};

export const completeFixed = async (
    fixedId: number,
    data?: { discount?: number | null; payment_date: string }
) => {
    try {
        const response = await api.post(
            `/fixeds/${fixedId}/complete`,
            data || { payment_date: new Date().toISOString().split('T')[0] }
        );
        return response.data;
    } catch (error) {
        console.error('Error completing fixed transaction:', error);
        throw error;
    }
};
