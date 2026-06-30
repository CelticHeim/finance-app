import { useState, useMemo, useEffect } from 'react';
import CalendarGrid from './CalendarGrid';
import { useCalendarQuery } from '../../hooks/useCalendarQuery';
import { useTransaction } from '../../contexts/TransactionContext';
import type { Transaction } from '@/types/entities/Transaction';

interface DayEvent {
    id: string;
    title: string;
    amount: number;
    color: string;
    type: 'income' | 'expense' | 'fixed' | 'installment';
    date: string;
    isPaid?: boolean;
    fixedId?: number;
    transactionData?: Transaction;
}

export default function Calendar() {
    const {
        currentMonth,
        currentYear,
        transactions,
        setMonth,
    } = useCalendarQuery();

    const { selectTransaction } = useTransaction();

    const [events, setEvents] = useState<DayEvent[]>([]);

    // Procesar eventos desde contexto
    useEffect(() => {
        const mappedEvents = (transactions || []).map(record => {
            const colorMap = {
                'income': '#10B981',
                'fixed': '#3B82F6',
                'installment': '#A855F7',
                'expense': '#EF4444',
            };

            const transactionDate = record.transaction_date?.split('T')[0] || record.transaction_date;

            return {
                id: `${record.type}-${record.id || record.transactionable_id}-${transactionDate}`,
                title: record.description || record.category,
                amount: parseFloat(record.amount),
                color: colorMap[record.type as keyof typeof colorMap] || '#EF4444',
                type: record.type,
                date: transactionDate,
                isPaid: record.status === 'completed',
                fixedId: record.type === 'fixed' ? record.transactionable_id : undefined,
                transactionData: record,
            };
        });

        setEvents(mappedEvents);
    }, [currentMonth, currentYear, transactions]);

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

    const handlePrevMonth = async () => {
        let newMonth = currentMonth - 1;
        let newYear = currentYear;

        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }

        await setMonth(newMonth, newYear);
    };

    const handleNextMonth = async () => {
        let newMonth = currentMonth + 1;
        let newYear = currentYear;

        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }

        await setMonth(newMonth, newYear);
    };

    const handleToday = async () => {
        const today = new Date();
        await setMonth(today.getMonth(), today.getFullYear());
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
            <CalendarGrid month={currentMonth} year={currentYear} events={eventsMap} onEventClick={selectTransaction} />
        </div>
    );
}
