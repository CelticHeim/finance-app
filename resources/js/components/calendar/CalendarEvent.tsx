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
            <div className="flex items-center gap-1 text-sm">
                {type === 'income' ? '+' : '-'} ${amount}: {title}
            </div>
        </div>
    );
}
