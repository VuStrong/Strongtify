import 'package:strongtify_mobile_app/models/album/album_detail.dart';

class AlbumDetailState {
  final AlbumDetail? album;
  final bool isLoading;

  AlbumDetailState({
    this.album,
    this.isLoading = false,
  });
}