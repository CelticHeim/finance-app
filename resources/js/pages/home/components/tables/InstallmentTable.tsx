import { useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';

export default function InstallmentTable() {
    const { installments, subscribe, loadInstallmentsIfNeeded } = useFinance();

    // Cargar datos cuando el componente se monta (si no están en cache)
    useEffect(() => {
        loadInstallmentsIfNeeded();
    }, [loadInstallmentsIfNeeded]);

    // Recargar cuando se recibe evento de 'installment-added'
    useEffect(() => {
        const unsubscribe = subscribe('installment-added', () => {
            loadInstallmentsIfNeeded();
        });

        return unsubscribe;
    }, [subscribe, loadInstallmentsIfNeeded]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                        Pagado
                    </span>
                );
            case 'pending':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        Pendiente
                    </span>
                );
            case 'overdue':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                        Vencido
                    </span>
                );
            default:
                return null;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const isOverdue = (dateString: string) => {
        const dueDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dueDate < today;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Pagos a Plazos
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-300 dark:border-gray-700">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Cuota
                            </th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Monto
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Vencimiento
                            </th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Estado
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {installments.length > 0 ? (
                            installments.map((installment) => (
                                <tr
                                    key={installment.id}
                                    className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                        isOverdue(installment.due_date) && installment.status === 'pending'
                                            ? 'bg-red-50 dark:bg-red-900/10'
                                            : ''
                                    }`}
                                >
                                    <td className="py-4 px-4 text-gray-900 dark:text-gray-100 font-medium">
                                        Cuota {installment.current_installment}/{installment.number_of_installments}
                                    </td>
                                    <td className="py-4 px-4 text-right text-gray-900 dark:text-gray-100 font-semibold">
                                        ${parseFloat(installment.amount).toFixed(2)}
                                    </td>
                                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                                        {formatDate(installment.due_date)}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        {getStatusBadge(installment.status)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="py-8 px-4 text-center text-gray-500 dark:text-gray-400"
                                >
                                    No hay pagos a plazos registrados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
