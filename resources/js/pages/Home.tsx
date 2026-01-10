import { useState, useEffect, useRef } from 'react';
import RegistroForm from '../components/RegistroForm';
import Calendar from '../components/calendar/Calendar';
import BalanceIndicator from '../components/BalanceIndicator';
import MovementsTable from '../components/MovementsTable';
import InstallmentTable from '../components/InstallmentTable';
import FixedTable from '../components/FixedTable';
import { getFinances, getDebts } from '../api/finances.api';
import type { TransactionRecord } from '../types/transactions.type';
import type { InstallmentRecord } from '../types/installments.type';
import type { FixedRecord } from '../types/fixeds.type';

export default function Home() {
    const [tableView, setTableView] = useState<'debts' | 'movements' | 'installments' | 'fixeds'>('movements');
    
    const [movements, setMovements] = useState<TransactionRecord[]>([]);
    const [installments, setInstallments] = useState<InstallmentRecord[]>([]);
    const [fixeds, setFixeds] = useState<FixedRecord[]>([]);
    
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const refreshKey = useRef(0);
    const [, setRefreshTrigger] = useState(0);

    // Función para refrescar los datos
    const refetchData = async (types: string[] = ['income', 'expense']) => {
        try {
            const typesString = types.length > 0 ? types.join(',') : 'income,expense';
            const [financeResponse, debtsResponse] = await Promise.all([
                getFinances(1, 10, { types: typesString }),
                getDebts(),
            ]);

            // Procesar datos de movimientos - pasar directamente sin mapear
            if (financeResponse?.data.data) {
                setMovements(financeResponse.data.data);
            }

            // Procesar datos de deudas (fixeds e installments)
            if (debtsResponse?.data) {
                setFixeds(debtsResponse.data.fixeds as FixedRecord[]);
                setInstallments(debtsResponse.data.installments as InstallmentRecord[]);
            }
        } catch (error) {
            console.error('Error fetching finances:', error);
        }
    };

    // Función para actualizar mes y año cuando el calendario cambia
    const handleMonthYearChange = (month: number, year: number) => {
        setCurrentMonth(month);
        setCurrentYear(year);
    };
    const notifyDataUpdated = () => {
        // Trigger para que Calendar se refresque
        refreshKey.current += 1;
        setRefreshTrigger(prev => prev + 1);
        // Refrescar tablas
        refetchData();
    };

    useEffect(() => {
        refetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="w-full">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                    Mis Finanzas
                </h1>

                {/* Balance Stats */}
                <BalanceIndicator 
                    month={currentMonth} 
                    year={currentYear}
                    onDataUpdated={() => refetchData()}
                />

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
                    {/* Left side - Registro Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <RegistroForm onDataUpdated={notifyDataUpdated} />
                        </div>
                    </div>

                    {/* Right side - Calendar */}
                    <div className="lg:col-span-4">
                        <Calendar 
                            key={refreshKey.current} 
                            onMonthYearChange={handleMonthYearChange}
                            installments={installments}
                            fixeds={fixeds}
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
                {tableView === 'movements' && <MovementsTable movements={movements} onTypesChange={(types) => refetchData(types)} />}
                {/* {tableView === 'debts' && <DebtTable debts={debts} />} */}
                {tableView === 'fixeds' && <FixedTable fixeds={fixeds as unknown as any} />}
                {tableView === 'installments' && <InstallmentTable installments={installments as unknown as any} />}
            </div>
        </div>
    );
}
