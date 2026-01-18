import { createContext, useContext, useCallback, useRef, ReactNode } from 'react';

type InvalidationCallback = () => void;

interface CacheInvalidationContextType {
    // Notificar que se agregó una transacción (income/expense)
    onTransactionAdded: () => void;
    // Notificar que se agregó un fixed
    onFixedAdded: () => void;
    // Notificar que se agregó un installment
    onInstallmentAdded: () => void;
    // Suscribirse a cambios de transacciones
    subscribeToTransactions: (callback: InvalidationCallback) => () => void;
    // Suscribirse a cambios de fixeds
    subscribeToFixeds: (callback: InvalidationCallback) => () => void;
    // Suscribirse a cambios de installments
    subscribeToInstallments: (callback: InvalidationCallback) => () => void;
}

const CacheInvalidationContext = createContext<CacheInvalidationContextType | undefined>(undefined);

export function CacheInvalidationProvider({ children }: { children: ReactNode }) {
    // Callbacks para cada tipo de invalidación
    const transactionCallbacks = useRef<Set<InvalidationCallback>>(new Set());
    const fixedCallbacks = useRef<Set<InvalidationCallback>>(new Set());
    const installmentCallbacks = useRef<Set<InvalidationCallback>>(new Set());

    // Suscribirse a cambios de transacciones
    const subscribeToTransactions = useCallback((callback: InvalidationCallback) => {
        transactionCallbacks.current.add(callback);
        
        // Retornar función de desuscripción
        return () => {
            transactionCallbacks.current.delete(callback);
        };
    }, []);

    // Suscribirse a cambios de fixeds
    const subscribeToFixeds = useCallback((callback: InvalidationCallback) => {
        fixedCallbacks.current.add(callback);
        
        return () => {
            fixedCallbacks.current.delete(callback);
        };
    }, []);

    // Suscribirse a cambios de installments
    const subscribeToInstallments = useCallback((callback: InvalidationCallback) => {
        installmentCallbacks.current.add(callback);
        
        return () => {
            installmentCallbacks.current.delete(callback);
        };
    }, []);

    // Notificar cambios de transacciones
    const onTransactionAdded = useCallback(() => {
        transactionCallbacks.current.forEach(callback => callback());
    }, []);

    // Notificar cambios de fixeds
    const onFixedAdded = useCallback(() => {
        fixedCallbacks.current.forEach(callback => callback());
    }, []);

    // Notificar cambios de installments
    const onInstallmentAdded = useCallback(() => {
        installmentCallbacks.current.forEach(callback => callback());
    }, []);

    const value: CacheInvalidationContextType = {
        onTransactionAdded,
        onFixedAdded,
        onInstallmentAdded,
        subscribeToTransactions,
        subscribeToFixeds,
        subscribeToInstallments,
    };

    return (
        <CacheInvalidationContext.Provider value={value}>
            {children}
        </CacheInvalidationContext.Provider>
    );
}

export function useCacheInvalidation() {
    const context = useContext(CacheInvalidationContext);
    if (context === undefined) {
        throw new Error('useCacheInvalidation must be used within a CacheInvalidationProvider');
    }
    return context;
}
