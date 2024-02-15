import 'package:strongtify_mobile_app/models/playlist/playlist.dart';

class UserRecentPlaylistsState {
  List<Playlist> playlists;
  final bool isLoading;

  UserRecentPlaylistsState({
    this.playlists = const [],
    this.isLoading = false,
  });
}