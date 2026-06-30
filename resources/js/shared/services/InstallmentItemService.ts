import { getInstallmentItem, completeInstallmentItem } from '@/shared/api/installment-items.api';
import { QueryKey } from '@/shared/constants/queryKeys';
import { queryClient } from '@/lib/queryClient';

export const installmentItemKeys = {
  all: [QueryKey.INSTALLMENT_ITEMS] as const,
  details: [QueryKey.INSTALLMENT_ITEMS, 'detail'] as const,
  detail: (id?: number) => [...installmentItemKeys.details, id] as const,
};

export const InstallmentItemService = {
  queryKey: installmentItemKeys.all,

  getById: (id?: number) => ({
    queryKey: installmentItemKeys.detail(id),
    queryFn: () => getInstallmentItem(id as number),
    enabled: typeof id === 'number' && !isNaN(id),
  }),

  complete: () => ({
    mutationFn: (id: number) => completeInstallmentItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: installmentItemKeys.all, exact: false });
    },
  }),
};
