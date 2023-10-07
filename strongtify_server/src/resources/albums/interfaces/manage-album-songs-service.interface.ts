/**
 * Interface for Album to manage songs in album
 */
export interface ManageAlbumSongsService {
    addSongsToAlbum(albumId: string, songIds: string[]): Promise<boolean>;

    removeSongFromAlbum(albumId: string, songId: string): Promise<boolean>;

    moveSong(albumId: string, songId: string, to: number): Promise<boolean>;
}
