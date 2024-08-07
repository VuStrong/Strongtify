/**
 * Interface for Song to deal with listen count
 */
export interface SongListenService {
    increaseListenCount(
        id: string,
        metadata?: {
            userId?: string;
            ip?: string;
        },
    ): Promise<void>;
}
