import 'package:strongtify_mobile_app/models/album/album.dart';

class AlbumsState {}

enum LoadAlbumsStatus {
  loading,
  loadingMore,
  loaded,
}

class LoadAlbumsState extends AlbumsState {
  final LoadAlbumsStatus status;
  final List<Album>? albums;
  final String? genreId;
  final String? artistId;
  final int skip;
  final int take;
  final bool end;
  final String? sort;

  LoadAlbumsState({
    this.status = LoadAlbumsStatus.loading,
    this.albums,
    this.genreId,
    this.artistId,
    this.skip = 0,
    this.take = 5,
    this.end = false,
    this.sort,
  });
}
