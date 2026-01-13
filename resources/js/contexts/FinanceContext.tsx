import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { getFinances, getCalendarData, getFixeds, getInstallments } from '../api/finances.api';
import type { SummaryData } from '../types/finances.types';
import type { FixedRecord } from '../types/fixeds.type';
import type { InstallmentRecord } from '../types/installments.type';
import type { TransactionRecord } from '../types/transactions.type';

// Tipos de eventos
type FinanceEvent = 
    | 'month-changed'
    | 'transaction-added'
    | 'fixed-added'
    | 'installment-added';

type EventCallback = (data?: any) => void;

// Tipo del contexto
interface FinanceContextType {
    // Estados (carga inicial)
    summary: SummaryData | null;
    transactions: TransactionRecord[];  // Para Calendar (todas del mes)
    fixeds: FixedRecord[];
    installments: InstallmentRecord[];
    currentMonth: number;
    currentYear: number;
    loading: boolean;
    selectedTransaction: TransactionRecord | null;

    // Acciones (solo para Calendar + BalanceIndicator)
    loadInitialData: () => Promise<void>;
    setMonth: (month: number, year: number) => Promise<void>;
    
    // Funciones para cacheo de datos (FixedTable + InstallmentTable)
    loadFixedsIfNeeded: () => Promise<void>;
    loadInstallmentsIfNeeded: () => Promise<void>;
    
    // Gestión de transacción seleccionada
    selectTransaction: (transaction: TransactionRecord | null) => void;
    
    // Sistema de eventos (otros componentes se suscriben)
    subscribe: (event: FinanceEvent, callback: EventCallback) => () => void;
    notifyTransactionAdded: () => void;
    notifyFixedAdded: () => void;
    notifyInstallmentAdded: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

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
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionRecord | null>(null);

    // Estados de cacheo (para evitar recargas innecesarias)
    const [fixedsLoaded, setFixedsLoaded] = useState(false);
    const [installmentsLoaded, setInstallmentsLoaded] = useState(false);

    // Sistema de eventos (pub-sub pattern)
    const subscribers = useRef<Map<FinanceEvent, Set<EventCallback>>>(new Map());

    // Función para suscribirse a eventos
    const subscribe = useCallback((event: FinanceEvent, callback: EventCallback) => {
        if (!subscribers.current.has(event)) {
            subscribers.current.set(event, new Set());
        }
        subscribers.current.get(event)!.add(callback);

        // Retorna función para desuscribirse
        return () => {
            subscribers.current.get(event)?.delete(callback);
        };
    }, []);

    // Función para emitir eventos
    const emit = useCallback((event: FinanceEvent, data?: any) => {
        const callbacks = subscribers.current.get(event);
        if (callbacks) {
            callbacks.forEach(callback => callback(data));
        }
    }, []);

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

    // Cambiar mes (actualiza summary y transactions de Calendar y BalanceIndicator)
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

            emit('month-changed', { month, year });
        } catch (error) {
            console.error('Error changing month:', error);
        } finally {
            setLoading(false);
        }
    }, [emit]);

    // Funciones para cargar datos con cacheo
    const loadFixedsIfNeeded = useCallback(async () => {
        // Si ya están cargados, no hacer nada
        if (fixedsLoaded) {
            return;
        }

        try {
            const response = await getFixeds();
            if (response?.data) {
                setFixeds(response.data);
                setFixedsLoaded(true);
            }
        } catch (error) {
            console.error('Error loading fixeds:', error);
        }
    }, [fixedsLoaded]);

    const loadInstallmentsIfNeeded = useCallback(async () => {
        // Si ya están cargados, no hacer nada
        if (installmentsLoaded) {
            return;
        }

        try {
            const response = await getInstallments();
            if (response?.data) {
                setInstallments(response.data);
                setInstallmentsLoaded(true);
            }
        } catch (error) {
            console.error('Error loading installments:', error);
        }
    }, [installmentsLoaded]);

    // Notificar que se agregó una transacción (income/expense)
    // Los componentes escuchan este evento y hacen su propia recarga
    const notifyTransactionAdded = useCallback(() => {
        emit('transaction-added');
    }, [emit]);

    // Notificar que se agregó un fixed
    // Invalidar cache de fixeds para que se recarguen
    const notifyFixedAdded = useCallback(() => {
        setFixedsLoaded(false);  // Invalidar cache
        emit('fixed-added');
    }, [emit]);

    // Notificar que se agregó un installment
    // Invalidar cache de installments para que se recarguen
    const notifyInstallmentAdded = useCallback(() => {
        setInstallmentsLoaded(false);  // Invalidar cache
        emit('installment-added');
    }, [emit]);

    // Seleccionar transacción para mostrar en modal
    const selectTransaction = useCallback((transaction: TransactionRecord | null) => {
        setSelectedTransaction(transaction);
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
        selectedTransaction,

        // Acciones (Calendar + BalanceIndicator)
        loadInitialData,
        setMonth,

        // Funciones de cacheo (FixedTable + InstallmentTable)
        loadFixedsIfNeeded,
        loadInstallmentsIfNeeded,
        
        // Gestión de transacción seleccionada
        selectTransaction,
        
        // Notificaciones
        notifyTransactionAdded,
        notifyFixedAdded,
        notifyInstallmentAdded,
        
        // Sistema de eventos
        subscribe,
    };

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );
}

// Hook personalizado para usar el contexto
export function useFinance() {
    const context = useContext(FinanceContext);
    if (context === undefined) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
}
