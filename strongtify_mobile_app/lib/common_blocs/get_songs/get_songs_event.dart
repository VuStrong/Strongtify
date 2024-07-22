abstract class GetSongsEvent {}

class GetSongsByParamsEvent extends GetSongsEvent {
  final String? genreId;
  final String? artistId;
  final String? sort;

  GetSongsByParamsEvent({
    this.artistId,
    this.genreId,
    this.sort,
  });
}

class GetCurrentUserLikedSongsEvent extends GetSongsEvent {}

class GetCurrentUserListenHistoryEvent extends GetSongsEvent {}

class RemoveSongFromListenHistoryEvent extends GetSongsEvent {
  final String songId;

  RemoveSongFromListenHistoryEvent({
    required this.songId,
  });
}

class GetMoreSongsEvent extends GetSongsEvent {}
