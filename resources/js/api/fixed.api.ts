import api from "@/lib/axios";
import type { CreateFixedData } from "@/types/fixeds.type";

export const createFixed = async (data: CreateFixedData) => {
    try {
        const response = await api.post('/fixeds', data);
        return response.data;
    } catch (error) {
        console.error('Error creating fixed expense:', error);
        throw error;
    }
};
