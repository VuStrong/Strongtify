abstract class SongsEvent {}

class GetSongsEvent extends SongsEvent {
  final String? genreId;
  final String? artistId;
  final String? sort;

  GetSongsEvent({
    this.artistId,
    this.genreId,
    this.sort,
  });
}

class GetMoreSongsEvent extends SongsEvent {}
