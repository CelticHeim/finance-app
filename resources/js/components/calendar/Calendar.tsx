import { useState, useMemo } from 'react';
import CalendarGrid from './CalendarGrid';

interface DayEvent {
    id: string;
    title: string;
    amount: number;
    color: string;
    type: 'income' | 'expense';
    isFixed?: boolean;
}

// Datos ficticios
const MOCK_EVENTS = [
    {
        id: '1',
        date: '2025-12-01',
        title: 'Sueldo',
        amount: 5000,
        color: '#10B981',
        type: 'income' as const,
    },
    {
        id: '2',
        date: '2025-12-03',
        title: 'Compra SuperM',
        amount: 470,
        color: '#F59E0B',
        type: 'expense' as const,
    },
    {
        id: '3',
        date: '2025-12-05',
        title: 'Netflix',
        amount: 199,
        color: '#8B5CF6',
        type: 'expense' as const,
        isFixed: true,
    },
    {
        id: '4',
        date: '2025-12-10',
        title: 'Cuota Moto (1/3)',
        amount: 1500,
        color: '#EF4444',
        type: 'expense' as const,
    },
    {
        id: '5',
        date: '2025-12-15',
        title: 'Electricidad',
        amount: 800,
        color: '#3B82F6',
        type: 'expense' as const,
        isFixed: true,
    },
    {
        id: '6',
        date: '2025-12-20',
        title: 'Bonus',
        amount: 1000,
        color: '#10B981',
        type: 'income' as const,
    },
    {
        id: '7',
        date: '2025-12-25',
        title: 'Regalo',
        amount: 300,
        color: '#F59E0B',
        type: 'expense' as const,
    },
    {
        id: '8',
        date: '2025-12-28',
        title: 'Gasolina',
        amount: 600,
        color: '#F59E0B',
        type: 'expense' as const,
        isFixed: true,
    },
];

export default function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const monthName = new Date(currentYear, currentMonth, 1).toLocaleString('es-ES', {
        month: 'long',
        year: 'numeric',
    });

    // Convertir eventos a Map para búsqueda rápida
    const eventsMap = useMemo(() => {
        const map = new Map<string, DayEvent[]>();
        MOCK_EVENTS.forEach((event) => {
            const [year, month, day] = event.date.split('-');
            const currentMonthNum = currentMonth;
            const currentYearNum = currentYear;

            if (parseInt(year) === currentYearNum && parseInt(month) === currentMonthNum + 1) {
                const dateKey = event.date;
                if (!map.has(dateKey)) {
                    map.set(dateKey, []);
                }
                map.get(dateKey)!.push({
                    id: event.id,
                    title: event.title,
                    amount: event.amount,
                    color: event.color,
                    type: event.type,
                    isFixed: event.isFixed,
                });
            }
        });
        return map;
    }, [currentMonth, currentYear]);

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
