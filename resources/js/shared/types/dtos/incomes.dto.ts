import type { Income } from "../entities/Income";
import type { PaginatedResponse } from "./common.dto";

export type CreateIncomeData = {
    amount: number | string;
    description: string;
    transaction_date: string;
    category: string;
};

export type PaginatedIncomeResponse = PaginatedResponse<Income>;
