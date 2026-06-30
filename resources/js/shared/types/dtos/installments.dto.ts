import type { Installment } from "../entities/Installment";
import type { PaginatedResponse } from "./common.dto";

export type CreateInstallmentData = {
    amount: number;
    description: string;
    category: string;
    number_of_installments: number;
    due_date: string;
};

export type PaginatedInstallmentResponse = PaginatedResponse<Installment>;
