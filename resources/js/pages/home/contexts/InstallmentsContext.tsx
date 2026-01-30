import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { getInstallments } from '@/api/finances.api';
import type { InstallmentRecord } from '@/types/installments.type';

interface InstallmentsContextType {
    installments: InstallmentRecord[];
    loading: boolean;
    
    loadInstallments: () => Promise<void>;
    refetchInstallments: () => Promise<void>;
}

const InstallmentsContext = createContext<InstallmentsContextType | undefined>(undefined);

export function InstallmentsProvider({ children }: { children: ReactNode }) {
    const [installments, setInstallments] = useState<InstallmentRecord[]>([]);
    const [loading, setLoading] = useState(false);

    const loadInstallments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getInstallments();
            if (response?.data) {
                setInstallments(response.data);
            }
        } catch (error) {
            console.error('Error loading installments:', error);
        } finally {
            setLoading(false);
        }
    }, []);

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

    const value = {
        installments,
        loading,
        loadInstallments,
        refetchInstallments,
    };

    return (
        <InstallmentsContext.Provider value={value}>
            {children}
        </InstallmentsContext.Provider>
    );
}

export function useInstallments() {
    const context = useContext(InstallmentsContext);
    if (context === undefined) {
        throw new Error('useInstallments must be used within an InstallmentsProvider');
    }
    return context;
}
