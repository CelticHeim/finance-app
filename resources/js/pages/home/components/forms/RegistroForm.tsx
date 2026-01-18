import { useState } from 'react';
import IncomeForm from './IncomeForm';
import ExpenseForm from './ExpenseForm';

type FormType = 'income' | 'expense';

interface RegistroFormProps {
    onDataUpdated?: () => void;
}

export default function RegistroForm({ onDataUpdated }: RegistroFormProps) {
    const [formType, setFormType] = useState<FormType>('expense');

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Registrar Transacción
            </h2>

            {/* Toggle between Income/Expense */}
            <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                    onClick={() => setFormType('income')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                        formType === 'income'
                            ? 'bg-green-500 text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                    + Ingreso
                </button>
                <button
                    onClick={() => setFormType('expense')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                        formType === 'expense'
                            ? 'bg-red-500 text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                    - Gasto
                </button>
            </div>

            {/* Render appropriate form */}
            {formType === 'income' && <IncomeForm onSubmitSuccess={onDataUpdated} />}
            {formType === 'expense' && <ExpenseForm onSubmitSuccess={onDataUpdated} />}
        </div>
    );
}
