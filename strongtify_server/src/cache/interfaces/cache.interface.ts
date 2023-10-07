export const CACHE_SERVICE = "CacheService";

export interface CacheService {
    get(key: string): Promise<any>;

    set(key: string, value: string, expire?: number): Promise<void>;

    delete(key: string): Promise<void>;
}
