import { createIncome } from '@/shared/api/incomes.api';
import { QueryKey } from '@/shared/constants/queryKeys';
import { queryClient } from '@/shared/lib/queryClient';
import type { CreateIncomeData } from '@/shared/types/dtos/incomes.dto';

export const incomeKeys = {
  all: [QueryKey.INCOMES] as const,
};

export const IncomeService = {
  queryKey: incomeKeys.all,

  create: () => ({
    mutationFn: (data: CreateIncomeData) => createIncome(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incomeKeys.all, exact: false });
    },
  }),
};
