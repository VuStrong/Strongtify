export interface StatisticPlaylistService {
    countPlaylistsToday(): Promise<number>;
}