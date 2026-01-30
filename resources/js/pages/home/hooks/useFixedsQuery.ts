import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getFixeds } from '@/api/finances.api';
import type { FixedRecord } from '@/types/fixeds.type';

export function useFixedsQuery() {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['fixeds'],
        queryFn: async () => {
            const response = await getFixeds();
            return response?.data || [];
        },
        staleTime: 1000 * 60 * 5,
    });

    const refetchFixeds = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['fixeds'] });
    }, [queryClient]);

    return {
        fixeds: (data || []) as FixedRecord[],
        loading: isLoading,
        refetchFixeds,
    };
}
