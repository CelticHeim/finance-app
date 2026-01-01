import { useState } from 'react';

export default function IncomeForm() {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const incomeCategories = [
        { value: 'sueldo', label: 'Sueldo', color: '#10B981' },
        { value: 'bonus', label: 'Bonus', color: '#059669' },
        { value: 'freelance', label: 'Freelance', color: '#34D399' },
        { value: 'otros', label: 'Otros', color: '#6EE7B7' },
    ];

    const [category, setCategory] = useState('sueldo');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            type: 'income',
            amount,
            description,
            category,
            date,
        });
        // Reset form
        setAmount('');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
        setCategory('sueldo');
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción
                </label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej: Sueldo quincenal"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    required
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    required
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
