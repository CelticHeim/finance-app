export type PaginatedResponse<T> = {
    message: string;
    data: {
        current_page: number;
        data: T[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: Array<{
            url: string | null;
            label: string;
            page: number | null;
            active: boolean;
        }>;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
};

export type ApiResponse<T> = {
    message: string;
    data: T;
};

// export type ApiErrorResponse = {
//     message: string;
//     errors?: Record<string, string[]>;
// };
