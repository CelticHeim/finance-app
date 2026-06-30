import CalendarDay from './CalendarDay';
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

interface CalendarGridProps {
    month: number;
    year: number;
    events: Map<string, DayEvent[]>;
    onEventClick?: (transaction: Transaction) => void;
}

export default function CalendarGrid({ month, year, events, onEventClick }: CalendarGridProps) {
    const today = new Date();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    // Array para almacenar todas las celdas
    const calendar: (number | null)[] = [];

    // Días del mes anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        calendar.push(null);
    }

    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
        calendar.push(i);
    }

    // Llenar el resto con null
    while (calendar.length % 7 !== 0) {
        calendar.push(null);
    }

    const weekdays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    const getEventsForDay = (day: number | null): DayEvent[] => {
        if (day === null) return [];
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.get(dateKey) || [];
    };

    const isToday = (day: number | null): boolean => {
        if (day === null) return false;
        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-0 mb-4">
                {weekdays.map((day) => (
                    <div
                        key={day}
                        className="text-center font-bold text-gray-700 dark:text-gray-300 py-2 border-b border-gray-300 dark:border-gray-700"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0 border border-gray-300 dark:border-gray-700">
                {calendar.map((day, index) => (
                    <CalendarDay
                        key={`${day}-${index}`}
                        day={day}
                        isCurrentMonth={day !== null}
                        isToday={isToday(day)}
                        events={getEventsForDay(day)}
                        onEventClick={onEventClick}
                        onClick={() => {
                            if (day !== null) {
                                console.log(`Clicked on ${month + 1}/${day}/${year}`);
                            }
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
