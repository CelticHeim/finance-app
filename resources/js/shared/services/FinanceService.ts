import {
  getFinances,
  getTransactions,
  getSummary,
  getFixeds,
  getCalendarData,
  getInstallments,
} from '@/shared/api/finances.api';
import { QueryKey } from '@/shared/constants/queryKeys';

export const financeKeys = {
  all: [QueryKey.FINANCES] as const,
  finances: [QueryKey.FINANCES, 'finances'] as const,
  transactions: [QueryKey.FINANCES, 'transactions'] as const,
  summary: [QueryKey.FINANCES, 'summary'] as const,
  fixeds: [QueryKey.FINANCES, 'fixeds'] as const,
  calendar: [QueryKey.FINANCES, 'calendar'] as const,
  installments: [QueryKey.FINANCES, 'installments'] as const,
};

export const FinanceService = {
  queryKey: financeKeys.all,

  getFinances: () => ({
    queryKey: financeKeys.finances,
    queryFn: () => getFinances(),
  }),

  getTransactions: (page: number = 1, limit: number = 10, filters?: { month?: number; year?: number; types?: string }) => ({
    queryKey: [...financeKeys.transactions, page, limit, filters],
    queryFn: () => getTransactions(page, limit, filters),
  }),

  getSummary: (month?: number, year?: number) => ({
    queryKey: [...financeKeys.summary, month, year],
    queryFn: () => getSummary(month, year),
  }),

  getFixeds: () => ({
    queryKey: financeKeys.fixeds,
    queryFn: () => getFixeds(),
  }),

  getCalendarData: (month?: number, year?: number) => ({
    queryKey: [...financeKeys.calendar, month, year],
    queryFn: () => getCalendarData(month, year),
  }),

  getInstallments: () => ({
    queryKey: financeKeys.installments,
    queryFn: () => getInstallments(),
  }),
};
