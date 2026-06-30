import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createIncome } from '@/shared/api/incomes.api';
import { createExpense } from '@/shared/api/expenses.api';
import { createFixed } from '@/shared/api/fixed.api';
import { createInstallment } from '@/shared/api/installment.api';
import type { CreateIncomeData } from '@/dtos/incomes.dto';
import type { CreateExpenseData } from '@/dtos/expenses.dto';
import type { CreateFixedData } from '@/dtos/fixeds.dto';
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
