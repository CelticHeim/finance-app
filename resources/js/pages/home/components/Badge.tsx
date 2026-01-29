interface BadgeProps {
    variant: 'type' | 'category';
    value: string;
    className?: string;
}

const typeColors: Record<string, { bg: string; text: string; icon: string }> = {
    income: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        icon: '+'
    },
    expense: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-300',
        icon: '-'
    },
    fixed: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-300',
        icon: '-'
    },
    installment: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-700 dark:text-purple-300',
        icon: '-'
    }
};

const categoryColors: Record<string, string> = {
    default: '#EF4444'
};

const getCategoryColor = (category: string): string => {
    return categoryColors[category] || '#10B981';
};

export default function Badge({ variant, value, className = '' }: BadgeProps) {
    if (variant === 'type') {
        const typeConfig = typeColors[value] || typeColors.expense;
        const typeLabel: Record<string, string> = {
            income: '+ Ingreso',
            expense: '- Gasto',
            fixed: '- Gasto Fijo',
            installment: '- Cuota'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeConfig.bg} ${typeConfig.text} ${className}`}>
                {typeLabel[value] || value}
            </span>
        );
    }

    if (variant === 'category') {
        const bgColor = getCategoryColor(value);
        return (
            <div
                className={`px-3 py-1 rounded-full text-xs font-semibold text-white w-fit ${className}`}
                style={{ backgroundColor: bgColor }}
            >
                {value}
            </div>
        );
    }

    return null;
}
