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

export const getInstallment = async (id: number) => {
    try {
        const response = await api.get(`/installments/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching installment:', error);
        throw error;
    }
};
