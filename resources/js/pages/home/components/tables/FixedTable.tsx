import { useEffect } from 'react';
import { useFixeds } from '../../contexts/FixedsContext';
import { useCacheInvalidation } from '@/contexts/CacheInvalidationContext';

export default function FixedTable() {
    const { fixeds, refetchFixeds } = useFixeds();
    const { subscribeToFixeds } = useCacheInvalidation();

    // Cargar datos cuando el componente se monta
    useEffect(() => {
        refetchFixeds();
    }, [refetchFixeds]);

    // Recargar cuando se recibe notificación de 'fixed-added'
    useEffect(() => {
        const unsubscribe = subscribeToFixeds(() => {
            refetchFixeds();
        });

        return unsubscribe;
    }, [subscribeToFixeds, refetchFixeds]);

    const getCategoryColor = (category: string): string => {
        const colors: { [key: string]: string } = {
            servicios: '#3B82F6',
            suscripciones: '#8B5CF6',
            comida: '#F59E0B',
            deudas: '#EF4444',
            transporte: '#10B981',
            otros: '#6B7280',
        };
        return colors[category.toLowerCase()] || '#6B7280';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Gastos Fijos Mensuales
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-300 dark:border-gray-700">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Descripción
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Categoría
                            </th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Monto
                            </th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Día del Mes
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {fixeds.length > 0 ? (
                            fixeds.map((fixed) => (
                                <tr
                                    key={fixed.id}
                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <td className="py-4 px-4 text-gray-900 dark:text-gray-100">
                                        {fixed.description || fixed.category}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span
                                            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                                            style={{
                                                backgroundColor: getCategoryColor(fixed.category),
                                            }}
                                        >
                                            {fixed.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right text-gray-900 dark:text-gray-100 font-semibold">
                                        ${parseFloat(fixed.amount).toFixed(2)}
                                    </td>
                                    <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400 font-medium">
                                        {formatDate(fixed.due_date)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="py-8 px-4 text-center text-gray-500 dark:text-gray-400"
                                >
                                    No hay gastos fijos registrados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
