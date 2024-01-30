import 'package:strongtify_mobile_app/models/album/album.dart';
import 'package:strongtify_mobile_app/models/album/album_detail.dart';

class AlbumState {}

class LoadAlbumByIdState extends AlbumState {
  final AlbumDetail? album;
  final bool isLoading;

  LoadAlbumByIdState({
    this.album,
    this.isLoading = false,
  });
}

enum LoadAlbumsStatus {
  loading,
  loadingMore,
  loaded,
}

class LoadAlbumsState extends AlbumState {
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
