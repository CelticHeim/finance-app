import { completeTransaction } from '@/shared/api/transaction.api';
import { QueryKey } from '@/shared/constants/queryKeys';
import { queryClient } from '@/lib/queryClient';

export const transactionKeys = {
  all: [QueryKey.TRANSACTIONS] as const,
};

export const TransactionService = {
  queryKey: transactionKeys.all,

  complete: () => ({
    mutationFn: ({ id, data }: { id: number; data?: { discount?: number | null } }) =>
      completeTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all, exact: false });
    },
  }),
};
