import { formatDate, isPast } from '@/shared/helpers/date-format';

interface Debt {
    id: string;
    description: string;
    amount: number;
    dueDate: string;
    status: 'pending' | 'paid' | 'overdue';
    category: string;
    categoryColor: string;
    installmentInfo?: {
        current: number;
        total: number;
        originalDebtId: string;
    };
}

interface DebtTableProps {
    debts?: Debt[];
}

export default function DebtTable({ debts }: DebtTableProps) {
    const dataToShow = debts || [];

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

    const isOverdue = (dateString: string) => {
        return isPast(dateString);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Registro Histórico de Deudas
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
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Vencimiento
                            </th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Estado
                            </th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                Cuota
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataToShow.map((debt, index) => (
                            <tr
                                key={debt.id}
                                className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                                    index % 2 === 0
                                        ? 'bg-white dark:bg-gray-800'
                                        : 'bg-gray-50 dark:bg-gray-800/50'
                                } ${
                                    debt.status === 'overdue'
                                        ? 'bg-red-50 dark:bg-red-900/10'
                                        : ''
                                }`}
                            >
                                <td className="py-4 px-4">
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {debt.description}
                                    </div>
                                    {debt.installmentInfo && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            ID Deuda Original: {debt.installmentInfo.originalDebtId}
                                        </div>
                                    )}
                                </td>
                                <td className="py-4 px-4">
                                    <div
                                        className="px-3 py-1 rounded-full text-xs font-semibold text-white w-fit"
                                        style={{ backgroundColor: debt.categoryColor }}
                                    >
                                        {debt.category}
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <div className="font-bold text-gray-900 dark:text-white">
                                        ${parseFloat(debt.amount).toFixed(2)}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div
                                        className={`font-medium ${
                                            isOverdue(debt.dueDate) && debt.status !== 'paid'
                                                ? 'text-red-600 dark:text-red-400'
                                                : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        {formatDate(debt.dueDate)}
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-center">
                                    {getStatusBadge(debt.status)}
                                </td>
                                <td className="py-4 px-4 text-center">
                                    {debt.installmentInfo ? (
                                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            {debt.installmentInfo.current} / {debt.installmentInfo.total}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            -
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {dataToShow.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                        No hay deudas registradas
                    </p>
                </div>
            )}

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                        Deudas Pendientes
                    </p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-300 mt-2">
                        ${dataToShow
                            .filter((d) => d.status === 'pending')
                            .reduce((sum, d) => sum + parseFloat(d.amount), 0)
                            .toFixed(2)}
                    </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                        Vencidas
                    </p>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-300 mt-2">
                        ${dataToShow
                            .filter((d) => d.status === 'overdue')
                            .reduce((sum, d) => sum + parseFloat(d.amount), 0)
                            .toFixed(2)}
                    </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                        Pagadas
                    </p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-300 mt-2">
                        ${dataToShow
                            .filter((d) => d.status === 'paid')
                            .reduce((sum, d) => sum + parseFloat(d.amount), 0)
                            .toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
}
