import { useState, useRef, useEffect } from 'react';

interface MultiSelectProps {
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    label?: string;
}

export default function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = 'Seleccionar opciones...',
    label,
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Cerrar el dropdown cuando se hace click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggleOption = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter((item) => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    const handleRemoveOption = (option: string) => {
        onChange(selected.filter((item) => item !== option));
    };

    const unselectedOptions = options.filter((opt) => !selected.includes(opt));

    return (
        <div ref={containerRef} className="relative w-full">
            {label && (
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {label}
                </label>
            )}
            
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer min-h-10 flex flex-wrap items-center gap-2"
            >
                {selected.length === 0 ? (
                    <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
                ) : (
                    selected.map((item) => (
                        <span
                            key={item}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
                        >
                            {item}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveOption(item);
                                }}
                                className="hover:opacity-80 transition-opacity"
                            >
                                ✕
                            </button>
                        </span>
                    ))
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50">
                    {unselectedOptions.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                            Todas las opciones están seleccionadas
                        </div>
                    ) : (
                        <div className="max-h-48 overflow-y-auto">
                            {unselectedOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => {
                                        handleToggleOption(option);
                                    }}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm text-gray-900 dark:text-white"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
