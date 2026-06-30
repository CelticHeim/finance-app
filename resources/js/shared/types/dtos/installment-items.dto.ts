export interface InstallmentItem {
    id: number;
    installment_id: number;
    amount: string;
    payment_date: string;
    paid_at: string | null;
    status: 'pending' | 'completed';
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface InstallmentItemResponse {
    message: string;
    data: InstallmentItem;
}
