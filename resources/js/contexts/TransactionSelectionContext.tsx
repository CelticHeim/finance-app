import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { TransactionRecord } from '@/types/transactions.type';

interface TransactionSelectionContextType {
    selectedTransaction: TransactionRecord | null;
    selectTransaction: (transaction: TransactionRecord | null) => void;
}

const TransactionSelectionContext = createContext<TransactionSelectionContextType | undefined>(undefined);

export function TransactionSelectionProvider({ children }: { children: ReactNode }) {
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionRecord | null>(null);

    const selectTransaction = useCallback((transaction: TransactionRecord | null) => {
        setSelectedTransaction(transaction);
    }, []);

    const value: TransactionSelectionContextType = {
        selectedTransaction,
        selectTransaction,
    };

    return (
        <TransactionSelectionContext.Provider value={value}>
            {children}
        </TransactionSelectionContext.Provider>
    );
}

export function useTransactionSelection() {
    const context = useContext(TransactionSelectionContext);
    if (context === undefined) {
        throw new Error('useTransactionSelection must be used within a TransactionSelectionProvider');
    }
    return context;
}
