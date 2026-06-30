import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeTransaction } from '@/shared/api/transaction.api';
import { completeInstallmentItem } from '@/shared/api/installment-items.api';
import { completeFixed } from '@/shared/api/fixed.api';
import type { Transaction } from '@/types/entities/Transaction';

export interface CompleteTransactionPayload {
    discount?: number | null;
    payment_date: string;
}

interface CompleteTransactionParams {
    transaction: Transaction;
    payload: CompleteTransactionPayload;
}

export function useCompleteTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ transaction, payload }: CompleteTransactionParams) => {
            const { discount, payment_date } = payload;

            switch (transaction.type) {
                case 'installment': {
                    const itemId = transaction.transactionable_id || transaction.installment_item_id;
                    if (!itemId) {
                        throw new Error('transactionable_id or installment_item_id is required for installment transactions');
                    }
                    return await completeInstallmentItem(itemId);
                }

                case 'fixed': {
                    const fixedId = transaction.transactionable_id || transaction.id;
                    if (!fixedId) {
                        throw new Error('transactionable_id or id is required for fixed transactions');
                    }
                    return await completeFixed(fixedId, {
                        discount: discount ?? null,
                        payment_date: payment_date,
                    });
                }

                case 'expense':
                case 'income':
                default: {
                    if (!transaction.id) {
                        throw new Error('id is required for expense/income transactions');
                    }
                    return await completeTransaction(transaction.id, {
                        discount: discount ?? null,
                    });
                }
            }
        },
        onMutate: async ({ transaction }) => {
            await queryClient.cancelQueries({ queryKey: ['calendar'] });
            await queryClient.cancelQueries({ queryKey: ['installments'] });

            const previousCalendar = queryClient.getQueryData(['calendar']);
            const previousInstallments = queryClient.getQueryData(['installments']);

            queryClient.setQueryData(['calendar'], (old: any) => {
                if (!old?.data?.transactions) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        transactions: old.data.transactions.map((t: Transaction) => {
                            const isInstallmentMatch = transaction.type === 'installment' && 
                                t.installment_item_id === transaction.installment_item_id;
                            
                            const isOtherMatch = transaction.type !== 'installment' && 
                                t.id === transaction.id && 
                                t.type === transaction.type;

                            if (isInstallmentMatch || isOtherMatch) {
                                return { ...t, status: 'completed' };
                            }

                            return t;
                        }),
                    },
                };
            });

            const shouldUpdateInstallments = transaction.type === 'installment' && transaction.installment_item;

            if (shouldUpdateInstallments) {
                queryClient.setQueryData(['installments'], (old: any) => {
                    if (!old?.data) return old;

                    return {
                        ...old,
                        data: old.data.map((installment: any) => {
                            if (!installment.items) return installment;

                            const hasItem = installment.items.some(
                                (item: any) => item.id === transaction.installment_item_id
                            );

                            if (!hasItem) return installment;

                            const updatedItems = installment.items.map((item: any) => {
                                if (item.id === transaction.installment_item_id) {
                                    return { ...item, status: 'completed' };
                                }
                                return item;
                            });

                            const completedCount = updatedItems.filter(
                                (item: any) => item.status === 'completed'
                            ).length;

                            const allCompleted = completedCount === installment.number_of_installments;

                            return {
                                ...installment,
                                items: updatedItems,
                                current_installment: completedCount,
                                status: allCompleted ? 'completed' : installment.status,
                            };
                        }),
                    };
                });
            }

            return { previousCalendar, previousInstallments };
        },
        onError: (err, variables, context) => {
            if (context?.previousCalendar) {
                queryClient.setQueryData(['calendar'], context.previousCalendar);
            }
            if (context?.previousInstallments) {
                queryClient.setQueryData(['installments'], context.previousInstallments);
            }
        },
        onSuccess: (data, { transaction }) => {
            if (transaction.type === 'installment') {
                queryClient.invalidateQueries({ queryKey: ['installments'] });
            }
            if (transaction.type === 'fixed') {
                queryClient.invalidateQueries({ queryKey: ['fixeds'] });
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['calendar'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });
}
