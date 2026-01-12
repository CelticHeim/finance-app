import { useState, useEffect } from 'react';
import RegistroForm from '../components/RegistroForm';
import Calendar from '../components/calendar/Calendar';
import BalanceIndicator from '../components/BalanceIndicator';
import MovementsTable from '../components/MovementsTable';
import InstallmentTable from '../components/InstallmentTable';
import FixedTable from '../components/FixedTable';
import { getFinances, getTransactions } from '../api/finances.api';
import type { InstallmentRecord } from '../types/installments.type';
import type { FixedRecord } from '../types/fixeds.type';
import type { TransactionRecord } from '../types/transactions.type';
import type { SummaryData } from '../types/finances.types';

export default function Home() {
    const [tableView, setTableView] = useState<'debts' | 'movements' | 'installments' | 'fixeds'>('movements');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    
    const [installments, setInstallments] = useState<InstallmentRecord[]>([]);
    const [fixeds, setFixeds] = useState<FixedRecord[]>([]);
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Cargar datos completos desde /finances
    const refetchFinances = async () => {
        try {
            const financeResponse = await getFinances();

            if (financeResponse?.data) {
                setFixeds(financeResponse.data.fixeds as FixedRecord[]);
                setInstallments(financeResponse.data.installments as InstallmentRecord[]);
                setSummary(financeResponse.data.summary as SummaryData);
                setTransactions(financeResponse.data.transactions as TransactionRecord[]);
            }
        } catch (error) {
            console.error('Error fetching finances:', error);
        }
    };

    // Cargar datos al montar el componente
    useEffect(() => {
        refetchFinances();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="w-full">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                    Mis Finanzas
                </h1>

                {/* Balance Stats */}
                {summary && <BalanceIndicator summary={summary} />}

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
                    {/* Left side - Registro Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <RegistroForm onDataUpdated={() => {
                                refetchFinances();
                                setRefreshTrigger(prev => prev + 1);
                            }} />
                        </div>
                    </div>

                    {/* Right side - Calendar */}
                    <div className="lg:col-span-4">
                        <Calendar 
                            fixeds={fixeds}
                            transactions={transactions}
                            onMonthYearChange={(month, year) => {
                                setSelectedMonth(month);
                                setSelectedYear(year);
                            }} 
                        />
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
                {tableView === 'movements' && <MovementsTable refreshTrigger={refreshTrigger} />}
                {/* {tableView === 'debts' && <DebtTable debts={debts} />} */}
                {tableView === 'fixeds' && <FixedTable fixeds={fixeds as unknown as any} />}
                {tableView === 'installments' && <InstallmentTable installments={installments as unknown as any} />}
            </div>
        </div>
    );
}

