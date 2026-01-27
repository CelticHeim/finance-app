import { useCallback } from 'react';
import { completeTransaction } from '@/api/transaction.api';
import { completeInstallment } from '@/api/installment.api';
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
                        // Installments expect: discount (optional) and payment_date
                        response = await completeInstallment(transaction.id, {
                            discount: discount ?? null,
                            payment_date: payment_date,
                        });
                        break;
                    }

                    case 'fixed': {
                        // Fixed expenses expect: discount (optional) and payment_date
                        const fixedId = transaction.transactionable_id;
                        response = await completeFixed(fixedId, {
                            discount: discount ?? null,
                            payment_date: payment_date,
                        });
                        break;
                    }

                    case 'expense':
                    case 'income':
                    default: {
                        // Regular transactions (expense/income) expect: discount (optional)
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
