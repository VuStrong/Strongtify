abstract class UserFavsEvent {}

class LoadAllFavsEvent extends UserFavsEvent {}

class LikeAlbumEvent extends UserFavsEvent {
  final String albumId;

  LikeAlbumEvent({required this.albumId});
}

class UnlikeAlbumEvent extends UserFavsEvent {
  final String albumId;

  UnlikeAlbumEvent({required this.albumId});
}

class LikePlaylistEvent extends UserFavsEvent {
  final String playlistId;

  LikePlaylistEvent({required this.playlistId});
}

class UnlikePlaylistEvent extends UserFavsEvent {
  final String playlistId;

  UnlikePlaylistEvent({required this.playlistId});
}

class LikeSongEvent extends UserFavsEvent {
  final String songId;

  LikeSongEvent({required this.songId});
}

class UnlikeSongEvent extends UserFavsEvent {
  final String songId;

  UnlikeSongEvent({required this.songId});
}

class FollowArtistEvent extends UserFavsEvent {
  final String artistId;

  FollowArtistEvent({required this.artistId});
}

class UnFollowArtistEvent extends UserFavsEvent {
  final String artistId;

  UnFollowArtistEvent({required this.artistId});
}

class FollowUserEvent extends UserFavsEvent {
  final String userId;

  FollowUserEvent({required this.userId});
}

class UnFollowUserEvent extends UserFavsEvent {
  final String userId;

  UnFollowUserEvent({required this.userId});
}