import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface ToastConfig {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    transactionType?: 'income' | 'expense' | 'installment' | 'fixed';
    duration?: number;
}

interface ToastContextType {
    toasts: ToastConfig[];
    showToast: (
        message: string,
        type?: 'success' | 'error' | 'info' | 'warning',
        duration?: number,
        transactionType?: 'income' | 'expense' | 'installment' | 'fixed'
    ) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastConfig[]>([]);

    const showToast = useCallback((
        message: string,
        type: 'success' | 'error' | 'info' | 'warning' = 'success',
        duration: number = 3000,
        transactionType?: 'income' | 'expense' | 'installment' | 'fixed'
    ) => {
        const id = Date.now().toString();
        const newToast: ToastConfig = { id, message, type, duration, transactionType };
        setToasts((prev) => [...prev, newToast]);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration + 300); // +300ms para que termine la animación de fade out
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
