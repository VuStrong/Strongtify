import 'package:strongtify_mobile_app/models/playlist/playlist.dart';

abstract class PlaylistsState {}

class LoadPlaylistsState extends PlaylistsState {
  final List<Playlist>? playlists;
  final bool isLoading;

  LoadPlaylistsState({
    this.playlists,
    this.isLoading = false,
  });
}
