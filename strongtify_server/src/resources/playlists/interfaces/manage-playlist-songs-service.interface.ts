/**
 * Interface for Playlist to manage songs in playlist
 */
export interface ManagePlaylistSongsService {
    addSongsToPlaylist(playlistId: string, songIds: string[]): Promise<boolean>;

    removeSongFromPlaylist(
        playlistId: string,
        songId: string,
    ): Promise<boolean>;

    moveSong(playlistId: string, songId: string, to: number): Promise<boolean>;
}
