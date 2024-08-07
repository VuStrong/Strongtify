/**
 * Interface for Album to manage songs in album
 */
export interface ManageAlbumSongsService {
    addSongsToAlbum(albumId: string, songIds: string[]): Promise<void>;

    removeSongFromAlbum(albumId: string, songId: string): Promise<void>;

    /**
     * Change order of songs in album
     * @param albumId - ID of album
     * @param songIds - An array contains ID of songs, order will be changed base on position of elements in array
     */
    changeSongsOrder(albumId: string, songIds: string[]): Promise<void>;
}
