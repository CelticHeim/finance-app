import { Check, X } from 'lucide-react';

interface CalendarEventProps {
    title: string;
    amount: number;
    color: string;
    type: 'income' | 'expense' | 'fixed' | 'installment';
    isPaid?: boolean;
}

export default function CalendarEvent({ title, amount, color, type, isPaid }: CalendarEventProps) {
    // Solo mostrar indicador de pago para eventos de tipo 'fixed'
    const showPaymentStatus = type === 'fixed' && isPaid !== undefined;

    return (
        <div
            className="px-2 py-1 rounded text-xs font-semibold text-white truncate relative group cursor-pointer flex items-center justify-between gap-1"
            style={{ backgroundColor: color, opacity: isPaid === false ? 0.7 : 1 }}
        >
            <div className="flex items-center gap-1 text-sm flex-1 min-w-0">
                {type === 'income' ? '+' : '-'} ${amount}: {title}
            </div>
            {showPaymentStatus && (
                <div className="flex-shrink-0 ml-1">
                    {isPaid ? (
                        <Check size={14} className="text-white" title="Pagado" />
                    ) : (
                        <X size={14} className="text-white" title="No pagado" />
                    )}
                </div>
            )}
        </div>
    );
}
