import { useState, useEffect } from 'react';
import RegistroForm from './components/forms/RegistroForm';
import Calendar from './components/calendar/Calendar';
import BalanceIndicator from './components/BalanceIndicator';
import MovementsTable from './components/tables/MovementsTable';
import InstallmentTable from './components/tables/InstallmentTable';
import FixedTable from './components/tables/FixedTable';
import TransactionDetails from './components/modals/TransactionDetails';
import { FinanceProvider, useFinance } from '../../contexts/FinanceContext';
import { TransactionSelectionProvider } from '../../contexts/TransactionSelectionContext';
import { CacheInvalidationProvider, useCacheInvalidation } from '../../contexts/CacheInvalidationContext';

function HomeContent() {
    const [tableView, setTableView] = useState<'debts' | 'movements' | 'installments' | 'fixeds'>('movements');

    // Obtener datos y funciones del contexto
    const {
        loadInitialData,
        refetchTransactions,
    } = useFinance();

    const {
        onTransactionAdded,
    } = useCacheInvalidation();

    // Cargar datos al montar el componente
    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <TransactionDetails />

            <div className="w-full">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                    Mis Finanzas
                </h1>

                {/* Balance Stats */}
                <BalanceIndicator />

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <RegistroForm onDataUpdated={() => {
                                // Notificar a todos los subscribers de que hay nuevas transacciones
                                onTransactionAdded();
                                // También refetch el contexto de finanzas para calendar y balance
                                refetchTransactions();
                            }} />
                        </div>
                    </div>

                    {/* Right side - Calendar */}
                    <div className="lg:col-span-4">
                        <Calendar />
                    </div>
                </div>

                {/* Table View Switch */}
                <div className="flex gap-2 mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 w-fit">
                    {/* <button
                        onClick={() => setTableView('debts')}
                        className={`px-6 py-2 rounded-md font-medium transition-all ${
                            tableView === 'debts'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        💳 Gastos
                    </button> */}
                    <button
                        onClick={() => setTableView('movements')}
                        className={`px-6 py-2 rounded-md font-medium transition-all ${tableView === 'movements'
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        📊 Transacciones
                    </button>
                    <button
                        onClick={() => setTableView('installments')}
                        className={`px-6 py-2 rounded-md font-medium transition-all ${tableView === 'installments'
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        📈 A Plazos
                    </button>
                    <button
                        onClick={() => setTableView('fixeds')}
                        className={`px-6 py-2 rounded-md font-medium transition-all ${tableView === 'fixeds'
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        📅 Gastos Fijos
                    </button>
                </div>

                {/* Tables */}
                <div className={tableView === 'movements' ? 'block' : 'hidden'}>
                    <MovementsTable />
                </div>
                {tableView === 'installments' && <InstallmentTable />}
                {tableView === 'fixeds' && <FixedTable />}
            </div>
        </div>
    );
}

// Componente principal que provee los contextos
export default function Home() {
    return (
        <FinanceProvider>
            <TransactionSelectionProvider>
                <CacheInvalidationProvider>
                    <HomeContent />
                </CacheInvalidationProvider>
            </TransactionSelectionProvider>
        </FinanceProvider>
    );
}

