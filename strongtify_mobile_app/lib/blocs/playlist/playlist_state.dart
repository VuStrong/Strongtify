import 'package:strongtify_mobile_app/models/playlist/playlist.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist_detail.dart';

abstract class PlaylistState {}

class LoadingPlaylistState extends PlaylistState {}

class LoadedPlaylistByIdState extends PlaylistState {
  final PlaylistDetail? playlist;

  LoadedPlaylistByIdState({
    this.playlist,
  });
}

class LoadedPlaylists extends PlaylistState {
  final List<Playlist> playlists;

  LoadedPlaylists({
    required this.playlists,
  });
}
