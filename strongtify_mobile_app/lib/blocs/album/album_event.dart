abstract class AlbumEvent {}

class GetAlbumByIdEvent extends AlbumEvent {
  final String id;

  GetAlbumByIdEvent({required this.id});
}

class GetAlbumsEvent extends AlbumEvent {
  final String? genreId;
  final String? artistId;
  final String? sort;

  GetAlbumsEvent({
    this.artistId,
    this.genreId,
    this.sort,
  });
}

class GetMoreAlbumsEvent extends AlbumEvent {}
