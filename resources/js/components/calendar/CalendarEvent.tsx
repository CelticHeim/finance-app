interface CalendarEventProps {
    title: string;
    amount: number;
    color: string;
    type: 'income' | 'expense';
    isFixed?: boolean;
}

export default function CalendarEvent({ title, amount, color, type, isFixed }: CalendarEventProps) {
    return (
        <div
            className="px-2 py-1 rounded text-xs font-semibold text-white truncate relative group cursor-pointer"
            style={{ backgroundColor: color }}
        >
            <div className="flex items-center gap-1">
                {type === 'income' ? '+' : '-'} ${amount}
            </div>
            <div className="text-xs truncate">{title}</div>
            {isFixed && (
                <div className="absolute bottom-0 right-0 w-1 h-1 bg-white rounded-full"></div>
            )}
        </div>
    );
}
