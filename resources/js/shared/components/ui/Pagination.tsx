interface Link {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
}

interface PaginationProps {
    links: Link[];
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export default function Pagination({ links, onPageChange, isLoading = false }: PaginationProps) {
    if (!links || links.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center justify-center gap-2 px-4 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            {links.map((link, index) => {
                const isDisabled = !link.url;
                const isActive = link.active;
                const pageNum = link.page;

                if (link.label.includes('Previous') || link.label.includes('anterior')) {
                    return (
                        <button
                            key={index}
                            onClick={() => pageNum && onPageChange(pageNum)}
                            disabled={isDisabled}
                            className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            ← Anterior
                        </button>
                    );
                }

                if (link.label.includes('Next') || link.label.includes('siguiente')) {
                    return (
                        <button
                            key={index}
                            onClick={() => pageNum && onPageChange(pageNum)}
                            disabled={isDisabled}
                            className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Siguiente →
                        </button>
                    );
                }

                return (
                    <button
                        key={index}
                        onClick={() => pageNum && onPageChange(pageNum)}
                        disabled={isDisabled}
                        className={`px-3 py-2 text-sm rounded-lg ${isActive
                                ? 'bg-blue-500 text-white font-medium'
                                : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                    >
                        {link.label}
                    </button>
                );
            })}
        </div>
    );
}
