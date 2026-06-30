import type { Transaction } from "../entities/Transaction";
import type { PaginatedResponse } from "./common.dto";

export type PaginatedTransactionResponse = PaginatedResponse<Transaction>;
