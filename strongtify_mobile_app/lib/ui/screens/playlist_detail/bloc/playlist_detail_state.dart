import 'package:strongtify_mobile_app/models/playlist/playlist_detail.dart';

class PlaylistDetailState {
  final PlaylistDetail? playlist;
  final bool isLoading;

  PlaylistDetailState({
    this.playlist,
    this.isLoading = false,
  });
}