import api from "@/lib/axios";

import type { InstallmentItemResponse } from "@/types/installment-items.types";

export const getInstallmentItem = async (
    itemId: number
): Promise<InstallmentItemResponse | undefined> => {
    try {
        const { data } = await api.get(`/installment-items/${itemId}`);
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const completeInstallmentItem = async (
    itemId: number
): Promise<InstallmentItemResponse | undefined> => {
    try {
        const { data } = await api.post(`/installment-items/${itemId}/complete`);
        return data;
    } catch (error) {
        console.error(error);
    }
};

