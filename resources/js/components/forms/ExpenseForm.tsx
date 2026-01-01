import { useState } from 'react';

export default function ExpenseForm() {
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
            type: 'expense',
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
        setCategory('comida');
        setIsFixed(false);
        setIsInstallment(false);
        setInstallments('1');
    };

    return (
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                    required
                />
            </div>

            {/* Description/Alias */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alias o descripción
                </label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej: Compra de 470 pesos"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                    required
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

            {/* Date */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha
                </label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                    required
                />
            </div>

            {/* Fixed expense checkbox */}
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

            {/* Installment checkbox */}
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

            {/* Installments count */}
            {isInstallment && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Número de cuotas
                    </label>
                    <select
                        value={installments}
                        onChange={(e) => setInstallments(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
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
