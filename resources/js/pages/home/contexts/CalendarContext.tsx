import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { getCalendarData } from '@/api/finances.api';
import type { SummaryData } from '@/types/finances.types';
import type { TransactionRecord } from '@/types/transactions.type';

interface CalendarContextType {
    transactions: TransactionRecord[];
    summary: SummaryData | null;
    currentMonth: number;
    currentYear: number;
    loading: boolean;

    loadCalendarData: () => Promise<void>;
    setMonth: (month: number, year: number) => Promise<void>;
    refetchTransactions: () => Promise<void>;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
    const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);

    const loadCalendarData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getCalendarData();
            if (response?.data) {
                setSummary(response.data.summary);
                setTransactions(response.data.transactions);
            }
        } catch (error) {
            console.error('Error loading calendar data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const setMonth = useCallback(async (month: number, year: number) => {
        setLoading(true);
        try {
            setCurrentMonth(month);
            setCurrentYear(year);

            const response = await getCalendarData(month + 1, year);
            if (response?.data) {
                setSummary(response.data.summary);
                setTransactions(response.data.transactions);
            }
        } catch (error) {
            console.error('Error changing month:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const refetchTransactions = useCallback(async () => {
        try {
            const response = await getCalendarData(currentMonth + 1, currentYear);
            if (response?.data) {
                setTransactions(response.data.transactions);
                setSummary(response.data.summary);
            }
        } catch (error) {
            console.error('Error refetching transactions:', error);
        }
    }, [currentMonth, currentYear]);

    const value = {
        transactions,
        summary,
        currentMonth,
        currentYear,
        loading,
        loadCalendarData,
        setMonth,
        refetchTransactions,
    };

    return (
        <CalendarContext.Provider value={value}>
            {children}
        </CalendarContext.Provider>
    );
}

export function useCalendar() {
    const context = useContext(CalendarContext);
    if (context === undefined) {
        throw new Error('useCalendar must be used within a CalendarProvider');
    }
    return context;
}
