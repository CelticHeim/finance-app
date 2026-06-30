import { createExpense } from '@/shared/api/expenses.api';
import { QueryKey } from '@/shared/constants/queryKeys';
import { queryClient } from '@/lib/queryClient';
import type { CreateExpenseData } from '@/shared/types/dtos/expenses.dto';

export const expenseKeys = {
  all: [QueryKey.EXPENSES] as const,
};

export const ExpenseService = {
  queryKey: expenseKeys.all,

  create: () => ({
    mutationFn: (data: CreateExpenseData) => createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all, exact: false });
    },
  }),
};
