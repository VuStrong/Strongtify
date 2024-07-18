/**
 * Interface for Song to deal with listen count
 */
export interface SongListenService {
    increaseListenCount(id: string, userId?: string): Promise<boolean>;
}
