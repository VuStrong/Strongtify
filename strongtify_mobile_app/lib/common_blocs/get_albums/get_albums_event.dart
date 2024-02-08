abstract class GetAlbumsEvent {}

class GetAlbumsByParamsEvent extends GetAlbumsEvent {
  final String? genreId;
  final String? artistId;
  final String? sort;

  GetAlbumsByParamsEvent({
    this.artistId,
    this.genreId,
    this.sort,
  });
}

class GetCurrentUserLikedAlbumsEvent extends GetAlbumsEvent {}

class GetMoreAlbumsEvent extends GetAlbumsEvent {}
