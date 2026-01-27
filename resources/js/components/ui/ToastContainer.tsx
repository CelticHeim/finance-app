import { useToast } from '@/contexts/ToastContext';
import Toast from '@/components/ui/Toast';

export default function ToastContainer() {
    const { toasts, removeToast } = useToast();

    const getTransactionLabel = (transactionType?: string): string => {
        switch (transactionType) {
            case 'income':
                return 'Ingreso';
            case 'expense':
                return 'Gasto';
            case 'installment':
                return 'Cuota';
            case 'fixed':
                return 'Gasto Fijo';
            default:
                return '';
        }
    };

    return (
        <div className="fixed top-6 right-6 flex flex-col gap-3 z-50 pointer-events-none">
            {toasts.map((toast) => {
                const transactionLabel = getTransactionLabel(toast.transactionType);
                const enhancedMessage = transactionLabel
                    ? `${transactionLabel} - ${toast.message}`
                    : toast.message;

                return (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast
                            message={enhancedMessage}
                            type={toast.type}
                            duration={toast.duration || 3000}
                            transactionType={toast.transactionType}
                            onClose={() => removeToast(toast.id)}
                        />
                    </div>
                );
            })}
        </div>
    );
}
