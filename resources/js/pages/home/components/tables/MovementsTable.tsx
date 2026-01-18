import { TransactionRecord } from '@/types/transactions.type';
import { useState, useEffect } from 'react';
import { getTransactions } from '@/api/finances.api';
import { useFinance } from '@/contexts/FinanceContext';
import MultiSelect from '@/components/ui/MultiSelect';

interface MovementsTableProps {
    refreshTrigger?: number;
}

export default function MovementsTable({ refreshTrigger = 0 }: MovementsTableProps) {
    const { subscribe, selectTransaction, selectedTransaction } = useFinance();
    const [movements, setMovements] = useState<TransactionRecord[]>([]);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    // Mapeo de tipos a nombres en español
    const typeLabels: Record<string, string> = {
        'income': 'Ingresos',
        'expense': 'Gastos',
        'installment': 'Cuotas',
        'fixed': 'Gastos Fijos'
    };

    const typeOptions = ['income', 'expense', 'installment', 'fixed'];

    // Get current month's first and last day
    const getCurrentMonthRange = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        return {
            from: formatDate(firstDay),
            to: formatDate(lastDay)
        };
    };

    const monthRange = getCurrentMonthRange();
    const [selectedTypes, setSelectedTypes] = useState<string[]>(['income', 'expense']);
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterDateFrom, setFilterDateFrom] = useState(monthRange.from);
    const [filterDateTo, setFilterDateTo] = useState(monthRange.to);

    // Suscribirse al evento 'transaction-added' para recargar datos
    useEffect(() => {
        const unsubscribe = subscribe('transaction-added', () => {
            setReloadTrigger(prev => prev + 1);
        });

        return unsubscribe;
    }, [subscribe]);

    // Cargar datos de la API cuando cambien los tipos seleccionados o cuando se reciba un evento de recarga
    useEffect(() => {
        const fetchMovements = async () => {
            try {
                const typesString = selectedTypes.length > 0 ? selectedTypes.join(',') : 'income,expense';
                const response = await getTransactions(1, 100, { types: typesString });

                if (response?.data) {
                    setMovements(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching movements:', error);
            }
        };

        fetchMovements();
    }, [selectedTypes, reloadTrigger]);

    // Filter data based on filters
    const filteredData = (movements || []).filter((movement) => {
        if (selectedTypes.length > 0 && !selectedTypes.includes(movement.type)) return false;
        if (filterCategory !== 'all' && movement.category !== filterCategory) return false;

        const movementDate = movement.transaction_date?.split('T')[0] || '';
        if (!movementDate || movementDate < filterDateFrom || movementDate > filterDateTo) return false;

        return true;
    });

    const dataToShow = filteredData;
    // Obtener categorías únicas
    const categories = Array.from(new Set((movements || []).map((m) => m.category)));

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
                {/* <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Filtros
                </h3> */}
                <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                    {/* Reset Filters Button */}
                    <button
                        onClick={() => {
                            setSelectedTypes(['income', 'expense']);
                            setFilterCategory('all');
                            setFilterDateFrom(monthRange.from);
                            setFilterDateTo(monthRange.to);
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
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Fecha
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Estado
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataToShow.map((movement, index) => (
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
                                    <div
                                        className="px-3 py-1 rounded-full text-xs font-semibold text-white w-fit"
                                        style={{ backgroundColor: movement.type === 'income' ? '#10B981' : '#EF4444' }}
                                    >
                                        {movement.category}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${movement.type === 'income'
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                : movement.type === 'fixed'
                                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                    : movement.type === 'installment'
                                                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                            }`}
                                    >
                                        {movement.type === 'income' ? '+ Ingreso' : '- Gasto'}
                                    </span>
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
                        ))}
                    </tbody>
                </table>
            </div>

            {dataToShow.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                        No hay movimientos registrados
                    </p>
                </div>
            )}
        </div>
    );
}
