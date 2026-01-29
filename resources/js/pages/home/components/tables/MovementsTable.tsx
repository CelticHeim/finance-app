import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/api/finances.api';
import { useTransactionSelection } from '@/contexts/TransactionSelectionContext';

import MultiSelect from '@/components/ui/MultiSelect';
import Pagination from '@/components/ui/Pagination';
import Badge from '../Badge';

export default function MovementsTable() {
    const { selectTransaction, selectedTransaction } = useTransactionSelection();

    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 10;

    const typeLabels: Record<string, string> = {
        'income': 'Ingresos',
        'expense': 'Gastos',
        'installment': 'Cuotas',
        'fixed': 'Gastos Fijos'
    };

    const typeOptions = ['income', 'expense', 'installment', 'fixed'];

    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['transactions', { types: selectedTypes.join(','), page: currentPage }],
        queryFn: async () => {
            const typesString = selectedTypes.length > 0 ? selectedTypes.join(',') : '';
            const response = await getTransactions(currentPage, perPage, selectedTypes.length > 0 ? { types: typesString } : {});
            return response?.data ?? null;
        },
        placeholderData: (previousData) => previousData
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [filterCategory, filterDateFrom, filterDateTo, selectedTypes]);

    const filteredData = (data?.data || []).filter((movement) => {
        if (filterCategory !== 'all' && movement.category !== filterCategory) return false;

        const movementDate = movement.transaction_date?.split('T')[0] || '';
        if (filterDateFrom && movementDate < filterDateFrom) return false;
        if (filterDateTo && movementDate > filterDateTo) return false;

        return true;
    });

    const categories = Array.from(new Set((data?.data || []).map((m) => m.category)));

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
                Historial de Transacciones
            </h2>

            {/* Filters */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                    {/* Reset Filters Button */}
                    <button
                        onClick={() => {
                            setSelectedTypes([]);
                            setFilterCategory('all');
                            setFilterDateFrom('');
                            setFilterDateTo('');
                            setCurrentPage(1);
                        }}
                        className="text-sm px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors whitespace-nowrap"
                    >
                        Limpiar Filtros
                    </button>

                    {/* Filters Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                        {/* Type Filter - MultiSelect */}
                        <MultiSelect
                            options={typeOptions.map(type => typeLabels[type])}
                            selected={selectedTypes.map(type => typeLabels[type])}
                            onChange={(selected) => {
                                const selectedKeys = selected.map(label =>
                                    Object.entries(typeLabels).find(([, val]) => val === label)?.[0] || ''
                                ).filter(Boolean);
                                setSelectedTypes(selectedKeys);
                            }}
                            label="Tipo"
                            placeholder="Seleccionar tipos..."
                        />

                        {/* Category Filter */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                Categoría
                            </label>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Todas</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date From Filter */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                Desde
                            </label>
                            <input
                                type="date"
                                value={filterDateFrom}
                                onChange={(e) => setFilterDateFrom(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Date To Filter */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                Hasta
                            </label>
                            <input
                                type="date"
                                value={filterDateTo}
                                onChange={(e) => setFilterDateTo(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
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
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Tipo
                            </th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Monto
                            </th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Descuento
                            </th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Monto Final
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Fecha
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Estado
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((movement, index) => (
                                <tr
                                    key={movement.id}
                                    onClick={() => selectTransaction(movement)}
                                    className={`border-b border-gray-200 dark:border-gray-700 transition-colors cursor-pointer ${selectedTransaction?.id === movement.id
                                        ? 'bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                                        : index % 2 === 0
                                            ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                            : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <td className="py-4 px-4">
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {movement.description || 'Sin descripción'}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <Badge variant="category" value={movement.category} />
                                    </td>
                                    <td className="py-4 px-4">
                                        <Badge variant="type" value={movement.type} />
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <div
                                            className={`font-bold text-lg ${movement.type === 'income'
                                                ? 'text-green-600 dark:text-green-400'
                                                : movement.type === 'fixed'
                                                    ? 'text-blue-600 dark:text-blue-400'
                                                    : movement.type === 'installment'
                                                        ? 'text-purple-600 dark:text-purple-400'
                                                        : 'text-red-600 dark:text-red-400'
                                                }`}
                                        >
                                            {movement.type === 'income' ? '+' : '-'} ${parseFloat(movement.amount).toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        {(movement.type === 'installment' || movement.type === 'fixed') ? (
                                            <div className="font-medium text-gray-700 dark:text-gray-300">
                                                {movement.discount ? `$${parseFloat(movement.discount).toFixed(2)}` : '-'}
                                            </div>
                                        ) : (
                                            <div className="text-gray-500 dark:text-gray-400">N/A</div>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        {(movement.type === 'installment' || movement.type === 'fixed') ? (
                                            <div
                                                className={`font-bold text-lg ${movement.type === 'fixed'
                                                    ? 'text-blue-600 dark:text-blue-400'
                                                    : 'text-purple-600 dark:text-purple-400'
                                                    }`}
                                            >
                                                - ${parseFloat(movement.final_amount).toFixed(2)}
                                            </div>
                                        ) : (
                                            <div className="text-gray-500 dark:text-gray-400">N/A</div>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="font-medium text-gray-700 dark:text-gray-300">
                                            {formatDate(movement.transaction_date.split('T')[0])}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${movement.status === 'completed'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                            }`}>
                                            {movement.status === 'completed' ? 'Completado' : 'Pendiente'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="py-8 text-center">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No hay movimientos registrados
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination
                links={data?.links || []}
                onPageChange={(page) => setCurrentPage(page)}
                isLoading={isLoading}
            />
        </div>
    );
}
