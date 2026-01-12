import { useState, useMemo, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import CalendarGrid from './CalendarGrid';
import type { FixedRecord } from '../../types/fixeds.type';
import type { TransactionRecord } from '../../types/transactions.type';

interface DayEvent {
    id: string;
    title: string;
    amount: number;
    color: string;
    type: 'income' | 'expense' | 'fixed' | 'installment';
    date: string;
    isPaid?: boolean;
    fixedId?: number;
}

interface CalendarProps {
    fixeds?: FixedRecord[];
    transactions?: TransactionRecord[];
    onMonthYearChange?: (month: number, year: number) => void;
}

export default function Calendar({ fixeds = [], transactions = [], onMonthYearChange }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [events, setEvents] = useState<DayEvent[]>([]);

    // Procesar eventos desde props
    useEffect(() => {
        try {
            let allEvents: DayEvent[] = [];

            // Procesar transacciones desde el prop
            if (transactions && Array.isArray(transactions)) {
                const mappedEvents = transactions.map(record => {
                    let color = '#EF4444'; // Default rojo
                    let isPaid = true;

                    if (record.type === 'income') {
                        color = '#10B981'; // Verde
                    } else if (record.type === 'fixed') {
                        color = '#3B82F6'; // Azul
                    } else if (record.type === 'installment') {
                        color = '#A855F7'; // Morado
                        // Para installments, usar el status del registro
                        isPaid = record.status === 'paid';
                    }

                    return {
                        id: `${record.type}-${record.id}`,
                        title: record.description || record.category,
                        amount: parseFloat(record.amount),
                        color: color,
                        type: record.type,
                        date: record.transaction_date?.split('T')[0] || record.transaction_date,
                        isPaid: isPaid,
                        fixedId: record.type === 'fixed' ? record.id : undefined,
                    };
                });
                allEvents = [...mappedEvents];
            }

            // Procesar gastos fijos del prop - siempre mostrar todos en todos los meses
            if (fixeds && fixeds.length > 0) {
                // Obtener IDs de fixeds pagados en este mes desde las transacciones
                const paidFixedIds = allEvents
                    .filter(event => event.type === 'fixed')
                    .map(event => event.fixedId)
                    .filter((id): id is number => id !== undefined);

                // Por cada fixed del prop, crear un evento si no existe en los eventos
                fixeds.forEach(fixed => {
                    // Extraer el día del due_date (puede ser ISO string o número)
                    let dueDay: number;

                    if (typeof fixed.due_date === 'string') {
                        // Si es una fecha ISO, extraer solo el día
                        if (fixed.due_date.includes('T')) {
                            // Formato: 2026-01-05T00:00:00.000000Z
                            const dateObj = new Date(fixed.due_date);
                            dueDay = dateObj.getDate();
                        } else {
                            // Formato: 2026-01-05
                            const dateObj = new Date(fixed.due_date);
                            dueDay = dateObj.getDate();
                        }
                    } else {
                        // Si es número, usarlo directamente
                        dueDay = parseInt(String(fixed.due_date), 10);
                    }

                    // Validar que sea un día válido
                    if (isNaN(dueDay) || dueDay < 1 || dueDay > 31) {
                        console.warn(`Invalid due_date for fixed ${fixed.id}: ${fixed.due_date}`);
                        return;
                    }

                    // Crear la fecha del pago
                    const date = new Date(currentYear, currentMonth, dueDay);
                    const dateStr = date.toISOString().split('T')[0];

                    // Determinar si este fixed fue pagado comparando con los de transacciones
                    const isPaid = paidFixedIds.includes(fixed.id);

                    // Verificar si ya existe un evento de este fixed (pagado desde transacciones)
                    const alreadyExists = allEvents.some(
                        e => e.type === 'fixed' && e.fixedId === fixed.id
                    );

                    // Siempre agregar el fixed (pagado o no)
                    // Si ya existe pagado, no lo agregaremos de nuevo (alreadyExists es true)
                    // Si no existe, lo agregamos con isPaid = false
                    if (!alreadyExists) {
                        allEvents.push({
                            id: `fixed-${fixed.id}`,
                            title: fixed.description || fixed.category,
                            amount: parseFloat(fixed.amount),
                            color: '#3B82F6',
                            type: 'fixed',
                            date: dateStr,
                            isPaid: isPaid,
                            fixedId: fixed.id,
                        });
                    } else {
                        // Si ya existe (fue pagado), actualizar isPaid a true
                        const existingEvent = allEvents.find(
                            e => e.type === 'fixed' && e.fixedId === fixed.id
                        );
                        if (existingEvent) {
                            existingEvent.isPaid = true;
                        }
                    }
                });
            }

            setEvents(allEvents);
        } catch (error) {
            console.error('Error processing calendar events:', error);
        }
        
        // Notificar al componente padre cuando cambien mes/año
        onMonthYearChange?.(currentMonth, currentYear);
    }, [currentMonth, currentYear, fixeds, transactions, onMonthYearChange]);

    const monthName = new Date(currentYear, currentMonth, 1).toLocaleString('es-ES', {
        month: 'long',
        year: 'numeric',
    });

    // Convertir eventos a Map para búsqueda rápida
    const eventsMap = useMemo(() => {
        const map = new Map<string, DayEvent[]>();
        events.forEach((event) => {
            const dateKey = event.date;
            if (!map.has(dateKey)) {
                map.set(dateKey, []);
            }
            map.get(dateKey)!.push(event);
        });
        return map;
    }, [events]);

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleToday = () => {
        const today = new Date();
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header with month navigation */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                    {monthName}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrevMonth}
                        className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium transition-all"
                    >
                        ← Anterior
                    </button>
                    <button
                        onClick={handleToday}
                        className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all"
                    >
                        Hoy
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium transition-all"
                    >
                        Siguiente →
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <CalendarGrid month={currentMonth} year={currentYear} events={eventsMap} />
        </div>
    );
}
