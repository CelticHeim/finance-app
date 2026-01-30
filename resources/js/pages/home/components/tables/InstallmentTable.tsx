import { useState, useEffect } from 'react';
import { useInstallments } from '../../contexts/InstallmentsContext';
import { useCacheInvalidation } from '@/contexts/CacheInvalidationContext';
import { useTransactionSelection } from '@/contexts/TransactionSelectionContext';
import type { InstallmentRecord } from '@/types/installments.type';
import type { InstallmentItem } from '@/types/installment-items.types';

export default function InstallmentTable() {
    const { installments, refetchInstallments } = useInstallments();
    const { subscribeToInstallments } = useCacheInvalidation();
    const { selectTransaction } = useTransactionSelection();
    const [expandedInstallmentId, setExpandedInstallmentId] = useState<number | null>(null);

    useEffect(() => {
        refetchInstallments();
    }, [refetchInstallments]);

    useEffect(() => {
        const unsubscribe = subscribeToInstallments(() => {
            refetchInstallments();
        });

        return unsubscribe;
    }, [subscribeToInstallments, refetchInstallments]);

    const toggleExpand = (installmentId: number) => {
        setExpandedInstallmentId(expandedInstallmentId === installmentId ? null : installmentId);
    };

    const handleItemClick = (item: InstallmentItem, installment: InstallmentRecord) => {
        const transactionPlaceholder = {
            id: null,
            type: 'installment' as const,
            description: installment.description,
            category: installment.category,
            amount: item.amount,
            discount: '0',
            transaction_date: item.payment_date,
            status: item.status,
            installment_item_id: item.id,
            installment_item: item,
            created_at: item.created_at,
            updated_at: item.updated_at,
            deleted_at: item.deleted_at,
        };

        selectTransaction(transactionPlaceholder);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                        Completado
                    </span>
                );
            case 'pending':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                        Pendiente
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

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Pagos a Plazos
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-300 dark:border-gray-700">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 w-12">
                                
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Descripción
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Categoría
                            </th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Monto Total
                            </th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Cuotas
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {installments.length > 0 ? (
                            installments.map((installment) => (
                                <>
                                    <tr
                                        key={installment.id}
                                        onClick={() => toggleExpand(installment.id)}
                                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                    >
                                        <td className="py-4 px-4">
                                            <svg
                                                className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
                                                    expandedInstallmentId === installment.id ? 'rotate-90' : ''
                                                }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </td>
                                        <td className="py-4 px-4 text-gray-900 dark:text-gray-100 font-medium">
                                            {installment.description}
                                        </td>
                                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                                            {installment.category}
                                        </td>
                                        <td className="py-4 px-4 text-right text-gray-900 dark:text-gray-100 font-semibold">
                                            ${parseFloat(installment.amount).toFixed(2)}
                                        </td>
                                        <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                                            {installment.current_installment}/{installment.number_of_installments}
                                        </td>
                                    </tr>

                                    {expandedInstallmentId === installment.id && installment.items && (
                                        <tr>
                                            <td colSpan={5} className="bg-gray-50 dark:bg-gray-900/50">
                                                <div className="px-4 py-3">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="border-b border-gray-300 dark:border-gray-700">
                                                                <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                                                                    Cuota
                                                                </th>
                                                                <th className="text-right py-2 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                                                                    Monto
                                                                </th>
                                                                <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                                                                    Fecha de Pago
                                                                </th>
                                                                <th className="text-center py-2 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                                                                    Estado
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {installment.items.map((item, index) => (
                                                                <tr
                                                                    key={item.id}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleItemClick(item, installment);
                                                                    }}
                                                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                                                >
                                                                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-200">
                                                                        Cuota {index + 1}
                                                                    </td>
                                                                    <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-gray-200 font-medium">
                                                                        ${parseFloat(item.amount).toFixed(2)}
                                                                    </td>
                                                                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-400">
                                                                        {formatDate(item.payment_date)}
                                                                    </td>
                                                                    <td className="py-3 px-4 text-center">
                                                                        {getStatusBadge(item.status)}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
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
