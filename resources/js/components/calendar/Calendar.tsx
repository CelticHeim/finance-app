import { useState, useMemo, useEffect } from 'react';
import CalendarGrid from './CalendarGrid';
import { getFinances } from '../../api/finances.api';

interface DayEvent {
    id: string;
    title: string;
    amount: number;
    color: string;
    type: 'income' | 'expense' | 'fixed' | 'installment';
    date: string;
}

interface CalendarProps {
    onMonthYearChange?: (month: number, year: number) => void;
}

export default function Calendar({ onMonthYearChange }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [events, setEvents] = useState<DayEvent[]>([]);

    // Cargar eventos del API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Obtener todos los tipos: income, expense, fixed, installment
                const response = await getFinances(1, 500, {
                    month: currentMonth + 1,
                    year: currentYear,
                    types: 'income,expense,fixed,installment'
                });
                let allEvents: DayEvent[] = [];

                // Procesar todos los eventos desde la respuesta
                if (response?.data.data && Array.isArray(response.data.data)) {
                    const mappedEvents = response.data.data.map(record => {
                        let color = '#EF4444'; // Default rojo

                        if (record.type === 'income') {
                            color = '#10B981'; // Verde
                        } else if (record.type === 'fixed') {
                            color = '#3B82F6'; // Azul
                        } else if (record.type === 'installment') {
                            color = '#A855F7'; // Morado
                        }

                        return {
                            id: `${record.type}-${record.id}`,
                            title: record.description || record.category,
                            amount: parseFloat(record.amount),
                            color: color,
                            type: record.type,
                            date: record.transaction_date?.split('T')[0] || record.transaction_date,
                        };
                    });
                    allEvents = [...mappedEvents];
                }

                setEvents(allEvents);
            } catch (error) {
                console.error('Error fetching calendar events:', error);
            }
        };

        fetchEvents();
        
        // Notificar al componente padre cuando cambien mes/año
        onMonthYearChange?.(currentMonth, currentYear);
    }, [currentMonth, currentYear, onMonthYearChange]);

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
