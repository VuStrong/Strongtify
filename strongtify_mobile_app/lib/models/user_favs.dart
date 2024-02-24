class UserFavs {
  Set<String> likedSongIds;
  Set<String> likedAlbumIds;
  Set<String> likedPlaylistIds;
  Set<String> followingArtistIds;
  Set<String> followingUserIds;

  UserFavs({
    this.likedSongIds = const {},
    this.likedAlbumIds = const {},
    this.likedPlaylistIds = const {},
    this.followingArtistIds = const {},
    this.followingUserIds = const {},
  });
}