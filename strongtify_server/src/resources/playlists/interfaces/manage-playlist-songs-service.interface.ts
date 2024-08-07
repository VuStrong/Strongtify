/**
 * Interface for Playlist to manage songs in playlist
 */
export interface ManagePlaylistSongsService {
    addSongsToPlaylist(playlistId: string, songIds: string[]): Promise<void>;

    removeSongFromPlaylist(
        playlistId: string,
        songId: string,
    ): Promise<void>;

    /**
     * Change order of songs in playlist
     * @param playlistId - ID of playlist
     * @param songIds - An array contains ID of songs, order will be changed base on position of elements in array
     */
    changeSongsOrder(playlistId: string, songIds: string[]): Promise<void>;
}
