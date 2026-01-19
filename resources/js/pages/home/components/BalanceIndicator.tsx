import { useFinance } from '@/contexts/FinanceContext';

export default function BalanceIndicator() {
    const { summary } = useFinance();

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Balance */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40 rounded-lg shadow-lg p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                            Balance Disponible
                        </p>
                        <p className="text-3xl font-bold text-green-900 dark:text-green-200">
                            ${summary?.available_balance || 0}
                        </p>
                    </div>
                    <div className="text-4xl text-green-200 dark:text-green-800">
                        💰
                    </div>
                </div>
            </div>

            {/* Total Debt */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/40 rounded-lg shadow-lg p-6 border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">
                            Deuda Total
                        </p>
                        <p className="text-3xl font-bold text-red-900 dark:text-red-200">
                            ${summary?.total_debt || 0}
                        </p>
                    </div>
                    <div className="text-4xl text-red-200 dark:text-red-800">
                        💳
                    </div>
                </div>
            </div>

            {/* Current Month Income */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 rounded-lg shadow-lg p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">
                            Ingresos Mes Actual
                        </p>
                        <p className="text-3xl font-bold text-blue-900 dark:text-blue-200">
                            ${summary?.current_month_income || 0}
                        </p>
                    </div>
                    <div className="text-4xl text-blue-200 dark:text-blue-800">
                        📈
                    </div>
                </div>
            </div>

            {/* Current Month Debt */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/40 rounded-lg shadow-lg p-6 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-2">
                            Deuda Mes Actual
                        </p>
                        <p className="text-3xl font-bold text-amber-900 dark:text-amber-200">
                            ${summary?.current_month_debt || 0}
                        </p>
                    </div>
                    <div className="text-4xl text-amber-200 dark:text-amber-800">
                        📅
                    </div>
                </div>
            </div>
        </div>
    );
}
