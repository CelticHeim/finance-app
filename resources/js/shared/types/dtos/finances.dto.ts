import type { PaginatedResponse, ApiResponse } from "./common.dto";
import type { Transaction } from "../entities/Transaction";
import type { Fixed } from "../entities/Fixed";
import type { Installment } from "../entities/Installment";

export type SummaryData = {
    available_balance: number;
    total_debt: number;
    current_month_income: number;
    current_month_debt: number;
};

export type FinanceIndexResponse = {
    message: string;
    data: {
        transactions: Transaction[];
        summary: SummaryData;
        fixeds: Fixed[];
        installments: Installment[];
    };
};

export type TransactionsResponse = PaginatedResponse<Transaction>;

export type SummaryResponse = {
    message: string;
    data: SummaryData;
};

export type FixedsResponse = {
    message: string;
    data: Fixed[];
};

export type InstallmentsResponse = {
    message: string;
    data: Installment[];
};

export type CalendarResponse = {
    message: string;
    data: {
        transactions: Transaction[];
        summary: SummaryData;
    };
};


