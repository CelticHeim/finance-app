import CalendarEvent from './CalendarEvent';

interface DayEvent {
    id: string;
    title: string;
    amount: number;
    color: string;
    type: 'income' | 'expense' | 'fixed' | 'installment';
    date: string;
}

interface CalendarDayProps {
    day: number | null;
    isCurrentMonth: boolean;
    isToday: boolean;
    events: DayEvent[];
    onClick?: () => void;
}

export default function CalendarDay({ day, isCurrentMonth, isToday, events, onClick }: CalendarDayProps) {
    if (day === null) {
        return <div className="min-h-24 bg-gray-50 dark:bg-gray-900"></div>;
    }

    return (
        <div
            onClick={onClick}
            className={`min-h-24 p-2 border border-gray-200 dark:border-gray-700 cursor-pointer transition-all ${
                isToday
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : isCurrentMonth
                      ? 'bg-white dark:bg-gray-800'
                      : 'bg-gray-50 dark:bg-gray-900'
            } hover:bg-gray-100 dark:hover:bg-gray-700`}
        >
            <div
                className={`text-sm font-bold mb-1 ${
                    isToday
                        ? 'text-blue-600 dark:text-blue-400'
                        : isCurrentMonth
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400 dark:text-gray-600'
                }`}
            >
                {day}
            </div>
            <div className="space-y-1 text-xs min-h-30">
                {events.map((event) => (
                    <CalendarEvent
                        key={event.id}
                        title={event.title}
                        amount={event.amount}
                        color={event.color}
                        type={event.type}
                    />
                ))}
                {events.length === 0 && isCurrentMonth && (
                    <div className="text-gray-300 dark:text-gray-600 text-xs">-</div>
                )}
            </div>
        </div>
    );
}
