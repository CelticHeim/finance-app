import { useForm } from 'react-hook-form';
import { createIncome } from '@/api/incomes.api';
import type { CreateIncomeData } from '@/types/incomes.type';

interface IncomeFormProps {
    onSubmitSuccess?: () => void;
}

export default function IncomeForm({ onSubmitSuccess }: IncomeFormProps) {
    const { register, handleSubmit, reset, watch } = useForm<CreateIncomeData>({
        defaultValues: {
            amount: '',
            category: 'sueldo',
            description: 'Sueldo semanal',
            // discount: 0,
            transaction_date: new Date().toISOString().split('T')[0],
        },
    });

    const incomeCategories = [
        { value: 'sueldo', label: 'Sueldo', color: '#10B981' },
        { value: 'bonus', label: 'Bonus', color: '#059669' },
        { value: 'freelance', label: 'Freelance', color: '#34D399' },
        { value: 'otros', label: 'Otros', color: '#6EE7B7' },
    ];

    const selectedCategory = watch('category');

    const onSubmit = async (data: CreateIncomeData) => {
        await createIncome(data);
        reset({
            amount: '',
            category: 'sueldo',
            description: 'Sueldo semanal',
            // discount: 0,
            transaction_date: new Date().toISOString().split('T')[0],
        });
        // Ejecutar callback después de éxito
        onSubmitSuccess?.();
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    {...register('amount', { valueAsNumber: true })}
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción
                </label>
                <input
                    type="text"
                    placeholder="Ej: Sueldo quincenal"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    {...register('description')}
                />
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Ingreso
                </label>
                <div className="flex flex-wrap gap-2">
                    {incomeCategories.map((cat) => (
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    {...register('transaction_date')}
                />
            </div>

            {/* Submit button */}
            <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg font-bold text-white bg-green-500 hover:bg-green-600 transition-all"
            >
                + Agregar Ingreso
            </button>
        </form>
    );
}
