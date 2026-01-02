import { useState, useMemo, useEffect } from 'react';
import CalendarGrid from './CalendarGrid';
import { getFinances } from '../../api/finances.api';

interface DayEvent {
    id: string;
    title: string;
    amount: number;
    color: string;
    type: 'income' | 'expense';
    isFixed?: boolean;
}

interface CalendarProps {
    onMonthYearChange?: (month: number, year: number) => void;
}

export default function Calendar({ onMonthYearChange }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [events, setEvents] = useState<DayEvent[]>([]);
    const [loading, setLoading] = useState(false);

    // Notificar cambios de mes/año
    useEffect(() => {
        onMonthYearChange?.(currentMonth + 1, currentYear);
    }, [currentMonth, currentYear, onMonthYearChange]);

    // Cargar eventos del API
    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const response = await getFinances(1, 100, currentMonth + 1, currentYear);
                if (response?.data) {
                    const mappedEvents = response.data.map(record => ({
                        id: String(record.id),
                        title: record.description || record.category,
                        amount: parseFloat(record.amount),
                        color: record.type === 'income' ? '#10B981' : '#EF4444',
                        type: record.type,
                        isFixed: false,
                        date: record.transaction_date,
                    }));
                    setEvents(mappedEvents);
                }
            } catch (error) {
                console.error('Error fetching calendar events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [currentMonth, currentYear]);

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
