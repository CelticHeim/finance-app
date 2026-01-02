import { useState, useEffect, useRef } from 'react';
import RegistroForm from '../components/RegistroForm';
import Calendar from '../components/calendar/Calendar';
import BalanceIndicator from '../components/BalanceIndicator';
import DebtTable from '../components/DebtTable';
import MovementsTable from '../components/MovementsTable';
import { getFinances } from '../api/finances.api';

export default function Home() {
    const [tableView, setTableView] = useState<'debts' | 'movements'>('debts');
    const [movements, setMovements] = useState<any[]>([]);
    const [debts, setDebts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const refreshKey = useRef(0);
    const [, setRefreshTrigger] = useState(0);
    const [updateTrigger, setUpdateTrigger] = useState(0);

    // Función para refrescar los datos
    const refetchData = async () => {
        try {
            const response = await getFinances(1);
            if (response?.data) {
                // Mapear los datos de la API al formato que espera MovementsTable
                const mappedMovements = response.data.map(record => ({
                    id: String(record.id),
                    description: record.description || record.category,
                    amount: parseFloat(record.amount),
                    type: record.type,
                    category: record.category,
                    categoryColor: record.type === 'income' ? '#10B981' : '#EF4444',
                    date: record.transaction_date,
                }));
                setMovements(mappedMovements);

                // Filtrar solo las deudas (installments) para DebtTable
                const mappedDebts = response.data
                    .filter(record => record.type === 'expense')
                    .map(record => ({
                        id: String(record.id),
                        description: record.description || record.category,
                        amount: parseFloat(record.amount),
                        dueDate: record.transaction_date,
                        status: 'pending' as const,
                        category: record.category,
                        categoryColor: '#EF4444',
                    }));
                setDebts(mappedDebts);
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
        // Trigger para que BalanceIndicator se refresque
        setUpdateTrigger(prev => prev + 1);
    };

    useEffect(() => {
        refetchData().then(() => setLoading(false));
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
                    onDataUpdated={() => setUpdateTrigger(prev => prev + 1)}
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
                        />
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
                {tableView === 'movements' && <MovementsTable movements={movements} />}
                {tableView === 'debts' && <DebtTable debts={debts} />}
            </div>
        </div>
    );
}
