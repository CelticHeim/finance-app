import { PaginatedResponse } from "./common.type";
import { TransactionRecord } from "./transactions.type";
import { FixedRecord } from "./fixeds.type";
import { InstallmentRecord } from "./installments.type";

// Resumen del mes actual
export type SummaryData = {
    available_balance: number;
    total_debt: number;
    current_month_income: number;
    current_month_debt: number;
};

// Respuesta del endpoint /finances (endpoint raíz)
export type FinanceIndexResponse = {
    message: string;
    data: {
        transactions: TransactionRecord[];
        summary: SummaryData;
        fixeds: FixedRecord[];
        installments: InstallmentRecord[];
    };
};

// Respuesta del endpoint /finances/transactions
export type TransactionsResponse = PaginatedResponse<TransactionRecord>;

// Respuesta del endpoint /finances/summary
export type SummaryResponse = {
    message: string;
    data: SummaryData;
};

// Respuesta del endpoint /finances/fixeds
export type FixedsResponse = {
    message: string;
    data: FixedRecord[];
};

// Respuesta del endpoint /finances/installments
export type InstallmentsResponse = {
    message: string;
    data: InstallmentRecord[];
};

// Respuesta del endpoint /finances/calendar (para Calendar y BalanceIndicator)
export type CalendarResponse = {
    message: string;
    data: {
        transactions: TransactionRecord[];
        summary: SummaryData;
    };
};


