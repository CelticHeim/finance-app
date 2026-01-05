import { useForm } from 'react-hook-form';
import { createExpense } from '@/api/expenses.api';
import { createFixed } from '@/api/fixed.api';
import { createInstallment } from '@/api/installment.api';

interface ExpenseFormData {
    amount: number;
    category: string;
    description?: string;
    expense_date: string;
    expenseType: 'normal' | 'fixed' | 'installment';
    total_installments?: number;
    day_of_month?: number;
}

interface ExpenseFormProps {
    onSubmitSuccess?: () => void;
}

export default function ExpenseForm({ onSubmitSuccess }: ExpenseFormProps) {
    const { register, handleSubmit, reset, watch } = useForm<ExpenseFormData>({
        defaultValues: {
            amount: 0,
            category: 'comida',
            description: '',
            expense_date: new Date().toISOString().split('T')[0],
            expenseType: 'normal',
            total_installments: 3,
            day_of_month: 10,
        },
    });

    const expenseCategories = [
        { value: 'comida', label: 'Comida', color: '#F59E0B' },
        { value: 'servicios', label: 'Servicios', color: '#3B82F6' },
        { value: 'suscripciones', label: 'Suscripciones', color: '#8B5CF6' },
        { value: 'deudas', label: 'Deudas', color: '#EF4444' },
    ];

    const selectedCategory = watch('category');
    const expenseType = watch('expenseType');

    const onSubmit = async (data: ExpenseFormData) => {
        try {
            if (data.expenseType === 'fixed' && data.day_of_month) {
                // Crear gasto fijo
                await createFixed({
                    amount: data.amount,
                    category: data.category,
                    description: data.description,
                    day_of_month: data.day_of_month,
                });
            } else if (data.expenseType === 'installment' && data.total_installments && data.day_of_month) {
                // Crear gasto a plazos
                await createInstallment({
                    amount: data.amount,
                    number_of_installments: parseInt(String(data.total_installments)),
                    due_date: data.expense_date,
                });
            } else if (data.expenseType === 'normal') {
                // Crear gasto normal
                await createExpense(data);
            }

            reset({
                amount: 0,
                category: 'comida',
                description: '',
                expense_date: new Date().toISOString().split('T')[0],
                expenseType: 'normal',
                total_installments: 3,
                day_of_month: 10,
            });
            onSubmitSuccess?.();
        } catch (error) {
            console.error('Error submitting expense:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Amount */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Monto
                </label>
                <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                    {...register('amount')}
                />
            </div>

            {/* Description/Alias */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alias o descripción
                </label>
                <input
                    type="text"
                    placeholder="Ej: Compra de 470 pesos"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                    {...register('description')}
                />
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categoría
                </label>
                <div className="flex flex-wrap gap-2">
                    {expenseCategories.map((cat) => (
                        <button
                            key={cat.value}
                            type="button"
                            onClick={() => {
                                register('category').onChange({
                                    target: { value: cat.value },
                                });
                            }}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                selectedCategory === cat.value
                                    ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800'
                                    : 'opacity-70 hover:opacity-100'
                            }`}
                            style={{
                                backgroundColor: cat.color,
                                color: 'white',
                            }}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
                <input type="hidden" {...register('category')} />
            </div>

            {/* Date */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha
                </label>
                <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                    {...register('expense_date')}
                />
            </div>

            {/* Expense type selector - Radio buttons */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Tipo de gasto
                </label>

                {/* Normal expense */}
                <div className="flex items-center gap-3">
                    <input
                        type="radio"
                        id="typeNormal"
                        value="normal"
                        className="w-4 h-4 border-gray-300 dark:border-gray-600"
                        {...register('expenseType')}
                    />
                    <label htmlFor="typeNormal" className="text-sm text-gray-700 dark:text-gray-300">
                        Gasto normal
                    </label>
                </div>

                {/* Fixed expense */}
                <div className="flex items-center gap-3">
                    <input
                        type="radio"
                        id="typeFixed"
                        value="fixed"
                        className="w-4 h-4 border-gray-300 dark:border-gray-600"
                        {...register('expenseType')}
                    />
                    <label htmlFor="typeFixed" className="text-sm text-gray-700 dark:text-gray-300">
                        Gasto fijo (se repite cada mes)
                    </label>
                </div>

                {/* Installment expense */}
                <div className="flex items-center gap-3">
                    <input
                        type="radio"
                        id="typeInstallment"
                        value="installment"
                        className="w-4 h-4 border-gray-300 dark:border-gray-600"
                        {...register('expenseType')}
                    />
                    <label htmlFor="typeInstallment" className="text-sm text-gray-700 dark:text-gray-300">
                        Pago a cuotas (MSI)
                    </label>
                </div>
            </div>

            {/* Day of month - for fixed and installment expenses */}
            {(expenseType === 'fixed' || expenseType === 'installment') && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Día del mes de pago
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="31"
                        placeholder="10"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                        {...register('day_of_month')}
                    />
                </div>
            )}

            {/* Installments count - only for installment expenses */}
            {expenseType === 'installment' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Número de cuotas
                    </label>
                    <select
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                        {...register('total_installments')}
                    >
                        <option value="1">1 cuota</option>
                        <option value="3">3 cuotas</option>
                        <option value="6">6 cuotas</option>
                        <option value="12">12 cuotas</option>
                    </select>
                </div>
            )}

            {/* Submit button */}
            <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition-all"
            >
                - Agregar Gasto
            </button>
        </form>
    );
}
