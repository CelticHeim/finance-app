import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import AlertDialog from '@/components/ui/AlertDialog';
import Button from '@/components/ui/Button';
import { getInstallment } from '@/api/installment.api';
import type { InstallmentRecord } from '@/types/installments.type';
import type { TransactionRecord } from '@/types/transactions.type';

interface InstallmentDetailsProps {
    isOpen: boolean;
    installment: InstallmentRecord | null;
    onClose: () => void;
}

export default function InstallmentDetails({ isOpen, installment, onClose }: InstallmentDetailsProps) {
    const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen && installment) {
            loadInstallmentDetails();
        }
    }, [isOpen, installment]);

    const loadInstallmentDetails = async () => {
        if (!installment) return;
        setLoading(true);
        try {
            const response = await getInstallment(installment.id);
            setTransactions(response.data?.transactions || []);
        } catch (error) {
            console.error('Error loading installment details:', error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    if (!installment) return null;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return (
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                        Pagado
                    </span>
                );
            case 'pending':
                return (
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                        Pendiente
                    </span>
                );
            default:
                return null;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatDateLong = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={(open) => {
                if (!open) onClose();
            }} className="max-w-2xl">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/40 border border-purple-200 dark:border-purple-800 px-6 py-4 rounded-t-lg">
                    <h2 className="text-xl font-bold text-purple-900 dark:text-purple-200">
                        Detalle de Pago a Plazo
                    </h2>
                </div>

                <div className="px-6 py-4 space-y-4">
                    {/* Installment Info */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            Descripción
                        </label>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {installment.description || 'Sin descripción'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                Categoría
                            </label>
                            <p className="text-gray-900 dark:text-gray-200">
                                {installment.category}
                            </p>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                Monto Total
                            </label>
                            <p className="text-lg font-bold text-red-600 dark:text-red-400">
                                ${parseFloat(installment.amount).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                Cuotas
                            </label>
                            <p className="text-gray-900 dark:text-gray-200">
                                {installment.current_installment} de {installment.number_of_installments}
                            </p>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                Vencimiento
                            </label>
                            <p className="text-gray-900 dark:text-gray-200">
                                {formatDateLong(installment.due_date)}
                            </p>
                        </div>
                    </div>

                    {/* Transactions List */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                            Transacciones
                        </h3>

                        {loading ? (
                            <div className="text-center py-4">
                                <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
                            </div>
                        ) : transactions.length > 0 ? (
                            <div className="space-y-2">
                                {transactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600"
                                    >
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {transaction.description}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                {formatDate(transaction.transaction_date)}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 ml-3">
                                            <div className="text-right mr-2">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    ${parseFloat(transaction.amount).toFixed(2)}
                                                </p>
                                                {getStatusBadge(transaction.status)}
                                            </div>

                                            {transaction.status === 'pending' && (
                                                <Button
                                                    onClick={() => setShowConfirmDialog(transaction.id)}
                                                    style="success"
                                                    size="sm"
                                                >
                                                    Pagar
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500 dark:text-gray-400">No hay transacciones registradas</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-6 py-4 flex gap-2">
                    <Button
                        onClick={onClose}
                        style="cancel"
                        className="flex-1"
                    >
                        Cerrar
                    </Button>
                </div>
            </Modal>

            {showConfirmDialog && (
                <AlertDialog
                    isOpen={showConfirmDialog !== null}
                    onOpenChange={() => setShowConfirmDialog(null)}
                    title="Confirmar Pago"
                    onConfirm={() => {
                        console.log('Pago confirmado para transacción:', showConfirmDialog);
                        // Aquí irá la lógica para marcar como pagado
                        setShowConfirmDialog(null);
                    }}
                    onCancel={() => setShowConfirmDialog(null)}
                    confirmText="Marcar como Pagado"
                    cancelText="Cancelar"
                >
                    <p className="text-gray-700 dark:text-gray-300">
                        ¿Deseas marcar como pagado esta cuota?
                    </p>
                </AlertDialog>
            )}
        </>
    );
}
