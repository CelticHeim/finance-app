import { createInstallment, getInstallment, completeInstallment } from '@/shared/api/installment.api';
import { QueryKey } from '@/shared/constants/queryKeys';
import { queryClient } from '@/shared/lib/queryClient';
import type { CreateInstallmentData } from '@/shared/types/dtos/installments.dto';

export const installmentKeys = {
  all: [QueryKey.INSTALLMENTS] as const,
  lists: [QueryKey.INSTALLMENTS, 'list'] as const,
  list: () => [...installmentKeys.lists] as const,
  details: [QueryKey.INSTALLMENTS, 'detail'] as const,
  detail: (id?: number) => [...installmentKeys.details, id] as const,
};

export const InstallmentService = {
  queryKey: installmentKeys.all,

  getById: (id?: number) => ({
    queryKey: installmentKeys.detail(id),
    queryFn: () => getInstallment(id as number),
    enabled: typeof id === 'number' && !isNaN(id),
  }),

  create: () => ({
    mutationFn: (data: CreateInstallmentData) => createInstallment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: installmentKeys.all, exact: false });
    },
  }),

  complete: () => ({
    mutationFn: ({ id, data }: { id: number; data?: { discount?: number | null; payment_date: string } }) =>
      completeInstallment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: installmentKeys.all, exact: false });
      queryClient.invalidateQueries({ queryKey: installmentKeys.detail() });
    },
  }),
};
