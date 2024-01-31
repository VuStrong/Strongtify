import 'package:strongtify_mobile_app/models/playlist/playlist.dart';

class PlaylistsState {}

enum LoadPlaylistsStatus {
  loading,
  loadingMore,
  loaded,
}

class LoadPlaylistsState extends PlaylistsState {
  final List<Playlist>? playlists;
  final LoadPlaylistsStatus status;
  final String? userId;
  final int skip;
  final int take;
  final bool end;
  final String? sort;

  LoadPlaylistsState({
    this.playlists,
    this.status = LoadPlaylistsStatus.loaded,
    this.userId,
    this.skip = 0,
    this.take = 5,
    this.end = false,
    this.sort,
  });
}
