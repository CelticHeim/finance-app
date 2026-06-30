import { createFixed, completeFixed } from '@/shared/api/fixed.api';
import { QueryKey } from '@/shared/constants/queryKeys';
import { queryClient } from '@/shared/lib/queryClient';
import type { CreateFixedData } from '@/shared/types/dtos/fixeds.dto';

export const fixedKeys = {
  all: [QueryKey.FIXEDS] as const,
};

export const FixedService = {
  queryKey: fixedKeys.all,

  create: () => ({
    mutationFn: (data: CreateFixedData) => createFixed(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fixedKeys.all, exact: false });
    },
  }),

  complete: () => ({
    mutationFn: ({ id, data }: { id: number; data?: { discount?: number | null; payment_date: string } }) =>
      completeFixed(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fixedKeys.all, exact: false });
    },
  }),
};
