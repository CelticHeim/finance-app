import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { getFixeds } from '@/api/finances.api';
import type { FixedRecord } from '@/types/fixeds.type';

interface FixedsContextType {
    fixeds: FixedRecord[];
    loading: boolean;
    
    loadFixeds: () => Promise<void>;
    refetchFixeds: () => Promise<void>;
}

const FixedsContext = createContext<FixedsContextType | undefined>(undefined);

export function FixedsProvider({ children }: { children: ReactNode }) {
    const [fixeds, setFixeds] = useState<FixedRecord[]>([]);
    const [loading, setLoading] = useState(false);

    const loadFixeds = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getFixeds();
            if (response?.data) {
                setFixeds(response.data);
            }
        } catch (error) {
            console.error('Error loading fixeds:', error);
        } finally {
            setLoading(false);
        }
    }, []);

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

    const value = {
        fixeds,
        loading,
        loadFixeds,
        refetchFixeds,
    };

    return (
        <FixedsContext.Provider value={value}>
            {children}
        </FixedsContext.Provider>
    );
}

export function useFixeds() {
    const context = useContext(FixedsContext);
    if (context === undefined) {
        throw new Error('useFixeds must be used within a FixedsProvider');
    }
    return context;
}
