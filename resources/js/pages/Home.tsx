import { useState } from 'react';
import RegistroForm from '../components/RegistroForm';
import Calendar from '../components/calendar/Calendar';
import BalanceIndicator from '../components/BalanceIndicator';
import DebtTable from '../components/DebtTable';
import MovementsTable from '../components/MovementsTable';

export default function Home() {
    const [tableView, setTableView] = useState<'debts' | 'movements'>('debts');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="w-full">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                    Mi Finanzas
                </h1>

                {/* Balance Stats */}
                <BalanceIndicator />

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
                    {/* Left side - Registro Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <RegistroForm />
                        </div>
                    </div>

                    {/* Right side - Calendar */}
                    <div className="lg:col-span-4">
                        <Calendar />
                    </div>
                </div>

                {/* Table View Switch */}
                <div className="flex gap-2 mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 w-fit">
                    <button
                        onClick={() => setTableView('debts')}
                        className={`px-6 py-2 rounded-md font-medium transition-all ${
                            tableView === 'debts'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        💳 Deudas
                    </button>
                    <button
                        onClick={() => setTableView('movements')}
                        className={`px-6 py-2 rounded-md font-medium transition-all ${
                            tableView === 'movements'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        📊 Movimientos
                    </button>
                </div>

                {/* Tables */}
                {tableView === 'movements' && <MovementsTable />}
                {tableView === 'debts' && <DebtTable />}
            </div>
        </div>
    );
}
