import api from "@/lib/axios";

type CreateInstallmentData = {
    amount: number;
    number_of_installments: number;
    due_date: string;
};

export const createInstallment = async (data: CreateInstallmentData) => {
    try {
        const response = await api.post('/installments', data);
        return response.data;
    } catch (error) {
        console.error('Error creating installment:', error);
        throw error;
    }
};
