import { useState } from 'react';

type FormType = 'income' | 'expense';

export default function RegistroForm() {
    const [formType, setFormType] = useState<FormType>('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('comida');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isFixed, setIsFixed] = useState(false);
    const [isInstallment, setIsInstallment] = useState(false);
    const [installments, setInstallments] = useState('1');

    const expenseCategories = [
        { value: 'comida', label: 'Comida', color: '#F59E0B' },
        { value: 'servicios', label: 'Servicios', color: '#3B82F6' },
        { value: 'suscripciones', label: 'Suscripciones', color: '#8B5CF6' },
        { value: 'deudas', label: 'Deudas', color: '#EF4444' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            type: formType,
            amount,
            description,
            category,
            date,
            isFixed,
            isInstallment,
            installments,
        });
        // Reset form
        setAmount('');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
        setIsFixed(false);
        setIsInstallment(false);
        setInstallments('1');
    };

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

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Amount */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Monto
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>

                {/* Description/Alias */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {formType === 'expense' ? 'Alias o descripción' : 'Descripción'}
                    </label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={formType === 'expense' ? 'Ej: Compra de 470 pesos' : 'Ej: Sueldo quincenal'}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>

                {/* Category (only for expenses) */}
                {formType === 'expense' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Categoría
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {expenseCategories.map((cat) => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setCategory(cat.value)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                        category === cat.value
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
                    </div>
                )}

                {/* Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Fecha
                    </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>

                {/* Fixed expense checkbox */}
                {formType === 'expense' && (
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isFixed"
                            checked={isFixed}
                            onChange={(e) => setIsFixed(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                        />
                        <label htmlFor="isFixed" className="text-sm text-gray-700 dark:text-gray-300">
                            Este es un gasto fijo (se repite cada mes)
                        </label>
                    </div>
                )}

                {/* Installment checkbox */}
                {formType === 'expense' && (
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isInstallment"
                            checked={isInstallment}
                            onChange={(e) => setIsInstallment(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                        />
                        <label htmlFor="isInstallment" className="text-sm text-gray-700 dark:text-gray-300">
                            Este es un pago a cuotas (MSI)
                        </label>
                    </div>
                )}

                {/* Installments count */}
                {formType === 'expense' && isInstallment && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Número de cuotas
                        </label>
                        <select
                            value={installments}
                            onChange={(e) => setInstallments(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                    className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all ${
                        formType === 'income'
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-red-500 hover:bg-red-600'
                    }`}
                >
                    {formType === 'income' ? '+ Agregar Ingreso' : '- Agregar Gasto'}
                </button>
            </form>
        </div>
    );
}
