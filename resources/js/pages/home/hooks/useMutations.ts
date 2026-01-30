import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createIncome } from '@/api/incomes.api';
import { createExpense } from '@/api/expenses.api';
import { createFixed } from '@/api/fixed.api';
import { createInstallment } from '@/api/installment.api';
import type { CreateIncomeData } from '@/types/incomes.type';
import type { CreateExpenseData } from '@/types/expenses.type';
import type { CreateFixedData } from '@/types/fixeds.type';
import type { CreateInstallmentData } from '@/types/installments.type';

export function useCreateIncome() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateIncomeData) => createIncome(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['calendar'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });
}

export function useCreateExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateExpenseData) => createExpense(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['calendar'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });
}

export function useCreateFixed() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateFixedData) => createFixed(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fixeds'] });
            queryClient.invalidateQueries({ queryKey: ['calendar'] });
        },
    });
}

export function useCreateInstallment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateInstallmentData) => createInstallment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['installments'] });
            queryClient.invalidateQueries({ queryKey: ['calendar'] });
        },
    });
}
