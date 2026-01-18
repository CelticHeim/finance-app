import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { getFinances, getCalendarData, getFixeds, getInstallments } from '../api/finances.api';
import type { SummaryData } from '../types/finances.types';
import type { FixedRecord } from '../types/fixeds.type';
import type { InstallmentRecord } from '../types/installments.type';
import type { TransactionRecord } from '../types/transactions.type';

// Tipo del contexto
interface FinanceContextType {
    // Estados
    summary: SummaryData | null;
    transactions: TransactionRecord[];
    fixeds: FixedRecord[];
    installments: InstallmentRecord[];
    currentMonth: number;
    currentYear: number;
    loading: boolean;

    // Acciones
    loadInitialData: () => Promise<void>;
    setMonth: (month: number, year: number) => Promise<void>;
    refetchTransactions: () => Promise<void>;
    refetchFixeds: () => Promise<void>;
    refetchInstallments: () => Promise<void>;
}

// Provider Component
export function FinanceProvider({ children }: { children: ReactNode }) {
    // Estados
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
    const [fixeds, setFixeds] = useState<FixedRecord[]>([]);
    const [installments, setInstallments] = useState<InstallmentRecord[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);

    // Cargar datos iniciales (mes actual)
    const loadInitialData = useCallback(async () => {
        setLoading(true);
        try {
            // Cargar fixeds e installments
            const financeResponse = await getFinances();
            console.log(financeResponse);
            
            if (financeResponse?.data) {
                setFixeds(financeResponse.data.fixeds);
                setInstallments(financeResponse.data.installments);
            }

            // Cargar transactions y summary para Calendar y BalanceIndicator (mes actual)
            const calendarResponse = await getCalendarData();
            if (calendarResponse?.data) {
                setSummary(calendarResponse.data.summary);
                setTransactions(calendarResponse.data.transactions);
            }
        } catch (error) {
            console.error('Error loading initial finances:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Cambiar mes (actualiza summary y transactions)
    const setMonth = useCallback(async (month: number, year: number) => {
        setLoading(true);
        try {
            setCurrentMonth(month);
            setCurrentYear(year);

            // Obtener transactions y summary del nuevo mes
            const calendarResponse = await getCalendarData(month + 1, year);
            if (calendarResponse?.data) {
                setSummary(calendarResponse.data.summary);
                setTransactions(calendarResponse.data.transactions);
            }
        } catch (error) {
            console.error('Error changing month:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Refetch transactions (se usa cuando se agrega un income/expense)
    const refetchTransactions = useCallback(async () => {
        try {
            const calendarResponse = await getCalendarData(currentMonth + 1, currentYear);
            if (calendarResponse?.data) {
                setTransactions(calendarResponse.data.transactions);
                setSummary(calendarResponse.data.summary);
            }
        } catch (error) {
            console.error('Error refetching transactions:', error);
        }
    }, [currentMonth, currentYear]);

    // Refetch fixeds (se usa cuando se agrega un fixed)
    const refetchFixeds = useCallback(async () => {
        try {
            const response = await getFixeds();
            if (response?.data) {
                setFixeds(response.data);
            }
        } catch (error) {
            console.error('Error refetching fixeds:', error);
        }
    }, []);

    // Refetch installments (se usa cuando se agrega un installment)
    const refetchInstallments = useCallback(async () => {
        try {
            const response = await getInstallments();
            if (response?.data) {
                setInstallments(response.data);
            }
        } catch (error) {
            console.error('Error refetching installments:', error);
        }
    }, []);

    const value: FinanceContextType = {
        // Estados
        summary,
        transactions,
        fixeds,
        installments,
        currentMonth,
        currentYear,
        loading,

        // Acciones
        loadInitialData,
        setMonth,
        refetchTransactions,
        refetchFixeds,
        refetchInstallments,
    };

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export function useFinance() {
    const context = useContext(FinanceContext);
    if (context === undefined) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
}
