import api from "@/lib/axios";

export const completeTransaction = async (id: number, data?: { discount?: number | null }) => {
    try {
        const response = await api.post(`/transactions/${id}/complete`, data || {});
        return response.data;
    } catch (error) {
        console.error('Error completing transaction:', error);
        throw error;
    }
};
