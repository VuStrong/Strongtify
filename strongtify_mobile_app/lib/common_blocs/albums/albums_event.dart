abstract class AlbumsEvent {}

class GetAlbumsEvent extends AlbumsEvent {
  final String? genreId;
  final String? artistId;
  final String? sort;

  GetAlbumsEvent({
    this.artistId,
    this.genreId,
    this.sort,
  });
}

class GetMoreAlbumsEvent extends AlbumsEvent {}
