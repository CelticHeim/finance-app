import api from "@/lib/axios";
import type { CreateInstallmentData } from "@/types/installments.type";

export const createInstallment = async (data: CreateInstallmentData) => {
    try {
        const response = await api.post('/installments', data);
        return response.data;
    } catch (error) {
        console.error('Error creating installment:', error);
        throw error;
    }
};
