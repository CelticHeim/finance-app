import api from "@/shared/lib/axios";

import type { InstallmentItemResponse } from "@/shared/types/dtos/installment-items.dto";

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

