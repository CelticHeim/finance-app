import type { Fixed } from "../entities/Fixed";
import type { PaginatedResponse } from "./common.dto";

export type CreateFixedData = {
    amount: number;
    category: string;
    description?: string;
    due_date: string;
};

export type PaginatedFixedResponse = PaginatedResponse<Fixed>;
