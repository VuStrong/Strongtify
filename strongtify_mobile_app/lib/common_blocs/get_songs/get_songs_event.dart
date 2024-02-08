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

class GetMoreSongsEvent extends GetSongsEvent {}
