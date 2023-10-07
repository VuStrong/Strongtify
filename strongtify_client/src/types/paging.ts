export type PagedResponse<T> = {
    results?: T[];

    total: number;
    skip: number;
    take: number;
    end: boolean;
}

export type PagingQuery = {
    skip: number;
    take: number;
    sort?: string;
}