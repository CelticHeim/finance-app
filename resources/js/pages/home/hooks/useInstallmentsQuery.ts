import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getInstallments } from '@/api/finances.api';
import type { InstallmentRecord } from '@/types/installments.type';

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
        installments: (data || []) as InstallmentRecord[],
        loading: isLoading,
        refetchInstallments,
    };
}
