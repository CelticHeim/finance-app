import { useState } from 'react';

interface Movement {
    id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    categoryColor: string;
    date: string;
    notes?: string;
}

interface MovementsTableProps {
    movements?: Movement[];
}

export default function MovementsTable({ movements }: MovementsTableProps) {
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');

    const dataToShow = movements || [];
    // Obtener categorías únicas
    const categories = Array.from(new Set(dataToShow.map((m) => m.category)));

    const formatDate = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Historial de Movimientos
            </h2>

            {/* Filters */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Filtros
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Type Filter */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                            Tipo
                        </label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Todos</option>
                            <option value="income">Ingresos</option>
                            <option value="expense">Gastos</option>
                        </select>
                    </div>

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

                {/* Reset Filters Button */}
                <div className="mt-4">
                    <button
                        onClick={() => {
                            setFilterType('all');
                            setFilterCategory('all');
                            setFilterDateFrom('');
                            setFilterDateTo('');
                        }}
                        className="text-sm px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                        Limpiar Filtros
                    </button>
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
                        </tr>
                    </thead>
                    <tbody>
                        {dataToShow.map((movement, index) => (
                            <tr
                                key={movement.id}
                                className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                                    index % 2 === 0
                                        ? 'bg-white dark:bg-gray-800'
                                        : 'bg-gray-50 dark:bg-gray-800/50'
                                }`}
                                title={movement.notes || ''}
                            >
                                <td className="py-4 px-4">
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {movement.description}
                                    </div>
                                    {movement.notes && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {movement.notes}
                                        </div>
                                    )}
                                </td>
                                <td className="py-4 px-4">
                                    <div
                                        className="px-3 py-1 rounded-full text-xs font-semibold text-white w-fit"
                                        style={{ backgroundColor: movement.categoryColor }}
                                    >
                                        {movement.category}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            movement.type === 'income'
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                        }`}
                                    >
                                        {movement.type === 'income' ? '+ Ingreso' : '- Gasto'}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <div
                                        className={`font-bold text-lg ${
                                            movement.type === 'income'
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-red-600 dark:text-red-400'
                                        }`}
                                    >
                                        {movement.type === 'income' ? '+' : '-'} ${movement.amount.toFixed(2)}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="font-medium text-gray-700 dark:text-gray-300">
                                        {formatDate(movement.date)}
                                    </div>
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

            {/* Summary */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                        Total Ingresos
                    </p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-300 mt-2">
                        ${dataToShow
                            .filter((m) => m.type === 'income')
                            .reduce((sum, m) => sum + m.amount, 0)
                            .toFixed(2)}
                    </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                        Total Gastos
                    </p>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-300 mt-2">
                        ${dataToShow
                            .filter((m) => m.type === 'expense')
                            .reduce((sum, m) => sum + m.amount, 0)
                            .toFixed(2)}
                    </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                        Balance Neto
                    </p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-300 mt-2">
                        ${(
                            dataToShow
                                .filter((m) => m.type === 'income')
                                .reduce((sum, m) => sum + m.amount, 0) -
                            dataToShow
                                .filter((m) => m.type === 'expense')
                                .reduce((sum, m) => sum + m.amount, 0)
                        ).toFixed(2)}
                    </p>
                </div>
            </div> */}
        </div>
    );
}
