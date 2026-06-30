import { useForm } from 'react-hook-form';
import { useToast } from '@/shared/contexts/ToastContext';
import { useCreateExpense, useCreateFixed, useCreateInstallment } from '../../hooks/useMutations';
import type { CreateExpenseData, ExpenseFormData } from '@/dtos/expenses.dto';
import type { CreateFixedData } from '@/dtos/fixeds.dto';
import type { CreateInstallmentData } from '@/types/installments.type';

export default function ExpenseForm() {
    const { register, handleSubmit, reset, watch } = useForm<ExpenseFormData>({
        defaultValues: {
            amount: undefined,
            category: 'comida',
            description: '',
            transaction_date: new Date().toISOString().split('T')[0],
            expenseType: 'expense',
            number_of_installments: 3,
            payment_day: 1,
        },
    });

    const { showToast } = useToast();
    const createExpenseMutation = useCreateExpense();
    const createFixedMutation = useCreateFixed();
    const createInstallmentMutation = useCreateInstallment();

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
            if (data.expenseType === 'fixed') {
                const fixedData: CreateFixedData = {
                    amount: parseFloat(data.amount as string),
                    category: data.category,
                    description: data.description,
                    due_date: data.payment_day?.toString() || '1',
                };
                await createFixedMutation.mutateAsync(fixedData);
            }

            if (data.expenseType === 'installment') {
                const installmentData: CreateInstallmentData = {
                    amount: parseFloat(data.amount as string),
                    description: data.description,
                    category: data.category,
                    number_of_installments: data.number_of_installments || 3,
                    due_date: data.transaction_date,
                };
                await createInstallmentMutation.mutateAsync(installmentData);
            }

            if (data.expenseType === 'expense') {
                const expenseData: CreateExpenseData = {
                    amount: parseFloat(data.amount as string),
                    description: data.description,
                    transaction_date: data.transaction_date,
                    category: data.category,
                };
                await createExpenseMutation.mutateAsync(expenseData);
            }

            reset({
                amount: '',
                category: 'comida',
                description: '',
                transaction_date: new Date().toISOString().split('T')[0],
                expenseType: 'expense',
                number_of_installments: 3,
                payment_day: 1,
            });

            showToast('Gasto registrado exitosamente', 'success');
        } catch (error) {
            console.error('Error submitting expense:', error);
            showToast('Error al registrar el gasto', 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                        value="expense"
                        className="w-4 h-4 border-gray-300 dark:border-gray-600"
                        {...register('expenseType')}
                    />
                    <label htmlFor="typeNormal" className="text-sm text-gray-700 dark:text-gray-300">
                        Gasto normal
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
            </div>

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
                    {...register('amount', { valueAsNumber: true })}
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
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === cat.value
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

            {/* Date - only for expense and installment */}
            {(expenseType === 'expense' || expenseType === 'installment') && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {expenseType === 'installment' ? 'Fecha del primer pago' : 'Fecha'}
                    </label>
                    <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                        {...register('transaction_date')}
                    />
                </div>
            )}

            {/* Payment day - only for fixed expenses */}
            {expenseType === 'fixed' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Día de pago
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="31"
                        placeholder="Ej: 15"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                        {...register('payment_day', { valueAsNumber: true })}
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
                        {...register('number_of_installments', { valueAsNumber: true })}
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
                disabled={createExpenseMutation.isPending || createFixedMutation.isPending || createInstallmentMutation.isPending}
                className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all ${(createExpenseMutation.isPending || createFixedMutation.isPending || createInstallmentMutation.isPending)
                        ? 'bg-red-400 cursor-not-allowed opacity-70'
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
            >
                {(createExpenseMutation.isPending || createFixedMutation.isPending || createInstallmentMutation.isPending) ? 'Guardando...' : '- Agregar Gasto'}
            </button>
        </form>
    );
}
