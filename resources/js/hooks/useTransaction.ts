import { useCallback } from 'react';
import { completeTransaction } from '@/api/transaction.api';
import { completeInstallmentItem } from '@/api/installment-items.api';
import { completeFixed } from '@/api/fixed.api';
import type { TransactionRecord } from '@/types/transactions.type';

export interface CompleteTransactionPayload {
    discount?: number | null;
    payment_date: string;
}

export const useTransaction = () => {
    const completeTransactionByType = useCallback(
        async (transaction: TransactionRecord, payload: CompleteTransactionPayload) => {
            const { discount, payment_date } = payload;

            try {
                let response;

                switch (transaction.type) {
                    case 'installment': {
                        if (!transaction.installment_item_id) {
                            throw new Error('installment_item_id is required for installment transactions');
                        }
                        response = await completeInstallmentItem(transaction.installment_item_id);
                        break;
                    }

                    case 'fixed': {
                        const fixedId = transaction.id;
                        response = await completeFixed(fixedId, {
                            discount: discount ?? null,
                            payment_date: payment_date,
                        });
                        break;
                    }

                    case 'expense':
                    case 'income':
                    default: {
                        response = await completeTransaction(transaction.id, {
                            discount: discount ?? null,
                        });
                        break;
                    }
                }

                return response;
            } catch (error) {
                console.error(
                    `Error completing ${transaction.type} transaction:`,
                    error
                );
                throw error;
            }
        },
        []
    );

    return {
        completeTransactionByType,
    };
};
