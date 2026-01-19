import { useToast } from '@/contexts/ToastContext';
import Toast from '@/components/ui/Toast';
import { TrendingUp, DollarSign, Calendar, RefreshCw } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export default function ToastContainer() {
    const { toasts, removeToast } = useToast();

    const getTransactionLabel = (transactionType?: string): { label: string; Icon: LucideIcon } | null => {
        switch (transactionType) {
            case 'income':
                return { label: 'Ingreso', Icon: TrendingUp };
            case 'expense':
                return { label: 'Gasto', Icon: DollarSign };
            case 'installment':
                return { label: 'Cuota', Icon: Calendar };
            case 'fixed':
                return { label: 'Gasto Fijo', Icon: RefreshCw };
            default:
                return null;
        }
    };

    return (
        <div className="fixed top-6 right-6 flex flex-col gap-3 z-50 pointer-events-none">
            {toasts.map((toast) => {
                const transactionInfo = getTransactionLabel(toast.transactionType);
                const enhancedMessage = transactionInfo
                    ? `${transactionInfo.label} - ${toast.message}`
                    : toast.message;

                return (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast
                            message={enhancedMessage}
                            type={toast.type}
                            duration={toast.duration || 3000}
                            transactionType={toast.transactionType}
                            Icon={transactionInfo?.Icon}
                            onClose={() => removeToast(toast.id)}
                        />
                    </div>
                );
            })}
        </div>
    );
}
