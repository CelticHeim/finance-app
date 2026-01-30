import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { getCalendarData } from '@/api/finances.api';
import type { SummaryData } from '@/types/finances.types';
import type { TransactionRecord } from '@/types/transactions.type';

export function useCalendarQuery() {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['calendar', currentMonth, currentYear],
        queryFn: async () => {
            const response = await getCalendarData(currentMonth + 1, currentYear);
            return response?.data;
        },
        staleTime: 1000 * 60 * 2,
    });

    const setMonth = useCallback(async (month: number, year: number) => {
        setCurrentMonth(month);
        setCurrentYear(year);
    }, []);

    const refetchTransactions = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['calendar', currentMonth, currentYear] });
    }, [queryClient, currentMonth, currentYear]);

    return {
        transactions: (data?.transactions || []) as TransactionRecord[],
        summary: (data?.summary || null) as SummaryData | null,
        currentMonth,
        currentYear,
        loading: isLoading,
        setMonth,
        refetchTransactions,
    };
}
