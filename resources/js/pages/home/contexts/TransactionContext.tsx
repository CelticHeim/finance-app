import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { TransactionRecord } from '@/types/transactions.type';

interface TransactionContextType {
    selectedTransaction: TransactionRecord | null;
    selectTransaction: (transaction: TransactionRecord | null) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionRecord | null>(null);

    const selectTransaction = useCallback((transaction: TransactionRecord | null) => {
        setSelectedTransaction(transaction);
    }, []);

    const value: TransactionContextType = {
        selectedTransaction,
        selectTransaction,
    };

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransaction() {
    const context = useContext(TransactionContext);
    if (context === undefined) {
        throw new Error('useTransaction must be used within a TransactionProvider');
    }
    return context;
}
