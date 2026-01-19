import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import AlertDialog from '@/components/ui/AlertDialog';
import Button from '@/components/ui/Button';
import { useTransactionSelection } from '@/contexts/TransactionSelectionContext';
import { useFinance } from '@/contexts/FinanceContext';
import { useToast } from '@/contexts/ToastContext';
import { completeTransaction } from '@/api/transaction.api';

export default function TransactionDetails() {
    const { selectedTransaction, selectTransaction } = useTransactionSelection();
    const { refetchTransactions } = useFinance();
    const { showToast } = useToast();
    const transaction = selectedTransaction;
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [applyDiscount, setApplyDiscount] = useState(false);
    const [discountValue, setDiscountValue] = useState<number | null>(null);
    const [changeDate, setChangeDate] = useState(false);
    const [newDate, setNewDate] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    if (!transaction) return null;

    const typeLabels: Record<string, string> = {
        'income': 'Ingreso',
        'expense': 'Gasto',
        'installment': 'Cuota',
        'fixed': 'Gasto Fijo'
    };

    const typeColors: Record<string, { bg: string; text: string; badge: string; headerBg: string; headerBorder: string; headerText: string }> = {
        'income': { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300', badge: 'bg-green-100 dark:bg-green-900/30', headerBg: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40', headerBorder: 'border-green-200 dark:border-green-800', headerText: 'text-green-900 dark:text-green-200' },
        'expense': { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300', badge: 'bg-red-100 dark:bg-red-900/30', headerBg: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/40', headerBorder: 'border-red-200 dark:border-red-800', headerText: 'text-red-900 dark:text-red-200' },
        'installment': { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-300', badge: 'bg-purple-100 dark:bg-purple-900/30', headerBg: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/40', headerBorder: 'border-purple-200 dark:border-purple-800', headerText: 'text-purple-900 dark:text-purple-200' },
        'fixed': { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', badge: 'bg-blue-100 dark:bg-blue-900/30', headerBg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40', headerBorder: 'border-blue-200 dark:border-blue-800', headerText: 'text-blue-900 dark:text-blue-200' }
    };

    const colors = typeColors[transaction.type] || typeColors['expense'];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <Modal isOpen={!!transaction} onOpenChange={(open) => {
                if (!open) selectTransaction(null);
            }}>
                <div className={`${colors.headerBg} border ${colors.headerBorder} px-6 py-4 rounded-t-lg`}>
                    <h2 className={`text-xl font-bold ${colors.headerText}`}>
                        Detalles de Transacción
                    </h2>
                </div>

                <div className="px-6 py-4">
                    {/* Type Badge */}
                    <div className="mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${colors.badge} ${colors.text}`}>
                            {typeLabels[transaction.type]}
                        </span>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            Descripción
                        </label>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {transaction.description || 'Sin descripción'}
                        </p>
                    </div>

                    {/* Category */}
                    <div className="mb-4">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            Categoría
                        </label>
                        <p className="text-gray-900 dark:text-gray-200">
                            {transaction.category}
                        </p>
                    </div>

                    {/* Amount */}
                    <div className="mb-4">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            Monto
                        </label>
                        <p className={`text-3xl font-bold ${transaction.type === 'income'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                            }`}>
                            {transaction.type === 'income' ? '+' : '-'} ${parseFloat(transaction.amount).toFixed(2)}
                        </p>
                    </div>

                    {/* Discount and Final Amount - only if discount was applied */}
                    {(transaction.type === 'installment' || transaction.type === 'fixed') && transaction.discount && parseFloat(transaction.discount) > 0 && (
                        <>
                            {/* Discount */}
                            <div className="mb-4">
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                    Descuento
                                </label>
                                <p className="text-lg font-medium text-gray-900 dark:text-white">
                                    ${parseFloat(transaction.discount).toFixed(2)}
                                </p>
                            </div>

                            {/* Final Amount */}
                            <div className="mb-4">
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                    Monto Final
                                </label>
                                <p className={`text-2xl font-bold ${transaction.type === 'fixed'
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-purple-600 dark:text-purple-400'
                                    }`}>
                                    - ${parseFloat(transaction.final_amount).toFixed(2)}
                                </p>
                            </div>
                        </>
                    )}

                    {/* Date */}
                    <div className="mb-4">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            Fecha
                        </label>
                        <p className="text-gray-900 dark:text-gray-200">
                            {formatDate(transaction.transaction_date)}
                        </p>
                    </div>

                    {/* Status */}
                    {transaction.status && (
                        <div className="mb-4">
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                Estado
                            </label>
                            <div className="flex items-center justify-between gap-3">
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${transaction.status === 'completed'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                    }`}>
                                    {transaction.status === 'completed' ? 'Completado' : 'Pendiente'}
                                </span>
                                {(transaction.type === 'installment' || transaction.type === 'fixed') && transaction.status !== 'completed' && (
                                    <Button
                                        onClick={() => setShowConfirmDialog(true)}
                                        style="success"
                                        size="sm"
                                    >
                                        Marcar como Pagado
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-6 py-4 flex gap-2">
                    <Button
                        onClick={() => selectTransaction(null)}
                        style="cancel"
                        className="flex-1"
                    >
                        Cerrar
                    </Button>
                </div>
            </Modal>

            <AlertDialog
                isOpen={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                title="Confirmar Pago"
                onConfirm={async () => {
                    if (!transaction) return;
                    
                    try {
                        setIsLoading(true);
                        const payload = applyDiscount && discountValue !== null && discountValue !== '' 
                            ? { discount: parseFloat(discountValue.toString()) }
                            : { discount: null };
                        
                        if (changeDate && newDate) {
                            payload.transaction_date = newDate;
                        }
                        
                        await completeTransaction(transaction.id, payload);
                        setShowConfirmDialog(false);
                        setApplyDiscount(false);
                        setDiscountValue(null);
                        setChangeDate(false);
                        setNewDate('');
                        showToast('Marcada como pagada', 'success', 3000, transaction.type as 'income' | 'expense' | 'installment' | 'fixed');
                        await refetchTransactions();
                        setTimeout(() => {
                            selectTransaction(null);
                        }, 300);
                    } catch (error) {
                        console.error('Error al marcar como pagado:', error);
                        showToast('Error al marcar como pagada', 'error');
                    } finally {
                        setIsLoading(false);
                    }
                }}
                onCancel={() => {
                    setShowConfirmDialog(false);
                    setApplyDiscount(false);
                    setDiscountValue(null);
                    setChangeDate(false);
                    setNewDate('');
                }}
                confirmText="Marcar como Pagado"
                cancelText="Cancelar"
            >
                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                        ¿Deseas marcar como pagado el {transaction?.type === 'installment' ? 'pago a plazo' : 'gasto fijo'} de{' '}
                        <span className="font-bold">{transaction?.description}</span> por{' '}
                        <span className="font-bold text-green-600 dark:text-green-400">${parseFloat(transaction?.amount || '0').toFixed(2)}</span>?
                    </p>
                    
                    {/* Checkbox para aplicar descuento */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="applyDiscount"
                            checked={applyDiscount}
                            onChange={(e) => setApplyDiscount(e.target.checked)}
                            disabled={isLoading}
                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 cursor-pointer"
                        />
                        <label htmlFor="applyDiscount" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                            Aplicar descuento
                        </label>
                    </div>
                    
                    {/* Campo descuento - solo se muestra si el checkbox está activo */}
                    {applyDiscount && (
                        <div>
                            <label htmlFor="discountInput" className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                Descuento
                            </label>
                            <input
                                id="discountInput"
                                type="number"
                                placeholder="Ingresa el monto del descuento"
                                value={discountValue ?? ''}
                                onChange={(e) => setDiscountValue(e.target.value === '' ? null : parseFloat(e.target.value))}
                                disabled={isLoading}
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
                        </div>
                    )}
                </div>
            </AlertDialog>
        </>
    );
}
