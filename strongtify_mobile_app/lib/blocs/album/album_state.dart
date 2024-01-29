import 'package:strongtify_mobile_app/models/album/album_detail.dart';

abstract class AlbumState {}

class LoadingAlbumState extends AlbumState {}

class LoadedAlbumByIdState extends AlbumState {
  final AlbumDetail? album;

  LoadedAlbumByIdState({
    this.album,
  });
}