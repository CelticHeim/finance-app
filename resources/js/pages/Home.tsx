import { useState, useEffect } from 'react';
import RegistroForm from '../components/RegistroForm';
import Calendar from '../components/calendar/Calendar';
import BalanceIndicator from '../components/BalanceIndicator';
import MovementsTable from '../components/MovementsTable';
import InstallmentTable from '../components/InstallmentTable';
import FixedTable from '../components/FixedTable';
import { FinanceProvider, useFinance } from '../contexts/FinanceContext';

function HomeContent() {
    const [tableView, setTableView] = useState<'debts' | 'movements' | 'installments' | 'fixeds'>('movements');
    
    // Obtener datos y funciones del contexto
    const {
        loadInitialData,
        notifyTransactionAdded,
        notifyFixedAdded,
        notifyInstallmentAdded,
    } = useFinance();

    // Cargar datos al montar el componente
    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
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
                                // Notificar según el tipo de registro agregado
                                notifyTransactionAdded();
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
                        className={`px-6 py-2 rounded-md font-medium transition-all ${
                            tableView === 'movements'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        📊 Transacciones
                    </button>
                    <button
                        onClick={() => setTableView('installments')}
                        className={`px-6 py-2 rounded-md font-medium transition-all ${
                            tableView === 'installments'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        📈 A Plazos
                    </button>
                    <button
                        onClick={() => setTableView('fixeds')}
                        className={`px-6 py-2 rounded-md font-medium transition-all ${
                            tableView === 'fixeds'
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
                {tableView === 'fixeds' && <FixedTable />}
                {tableView === 'installments' && <InstallmentTable />}
            </div>
        </div>
    );
}

// Componente principal que provee el contexto
export default function Home() {
    return (
        <FinanceProvider>
            <HomeContent />
        </FinanceProvider>
    );
}

