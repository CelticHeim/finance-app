import { Check, X } from 'lucide-react';
import { useState } from 'react';

interface CalendarEventProps {
    title: string;
    amount: number;
    color: string;
    type: 'income' | 'expense' | 'fixed' | 'installment';
    isPaid?: boolean;
    onClick?: () => void;
}

export default function CalendarEvent({ title, amount, color, type, isPaid, onClick }: CalendarEventProps) {
    const [isActive, setIsActive] = useState(false);

    // Solo mostrar indicador de pago para eventos de tipo 'fixed'
    const showPaymentStatus = type === 'fixed' && isPaid !== undefined;

    const handleClick = () => {
        setIsActive(true);
        onClick?.();
        // Resetear el estado activo después de un tiempo
        setTimeout(() => setIsActive(false), 200);
    };

    return (
        <div
            onClick={handleClick}
            className="px-2 py-1 rounded text-xs font-semibold text-white truncate relative group cursor-pointer flex items-center justify-between gap-1 transition-all"
            style={{ 
                backgroundColor: color, 
                opacity: isPaid === false ? 0.7 : 1,
                filter: isActive ? 'brightness(0.85)' : 'brightness(1)',
                transform: isActive ? 'scale(0.98)' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.filter = 'brightness(1.15)';
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.filter = isActive ? 'brightness(0.85)' : 'brightness(1)';
            }}
        >
            <div className="flex items-center gap-1 text-sm flex-1 min-w-0">
                {type === 'income' ? '+' : '-'} ${amount}: {title}
            </div>
            {showPaymentStatus && (
                <div className="flex-shrink-0 ml-1" title={isPaid ? 'Pagado' : 'No pagado'}>
                    {isPaid ? (
                        <Check size={14} className="text-white" />
                    ) : (
                        <X size={14} className="text-white" />
                    )}
                </div>
            )}
        </div>
    );
}
