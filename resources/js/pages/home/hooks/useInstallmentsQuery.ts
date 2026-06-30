import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getInstallments } from '@/shared/api/finances.api';
import type { Installment } from '@/types/entities/Installment';

export function useInstallmentsQuery() {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['installments'],
        queryFn: async () => {
            const response = await getInstallments();
            return response?.data || [];
        },
        staleTime: 1000 * 60 * 5,
    });

    const refetchInstallments = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['installments'] });
    }, [queryClient]);

    return {
        installments: (data || []) as Installment[],
        loading: isLoading,
        refetchInstallments,
    };
}
