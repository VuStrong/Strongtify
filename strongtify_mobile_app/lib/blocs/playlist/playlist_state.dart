import 'package:strongtify_mobile_app/models/playlist/playlist_detail.dart';

abstract class PlaylistState {}

class LoadingPlaylistState extends PlaylistState {}

class LoadedPlaylistByIdState extends PlaylistState {
  final PlaylistDetail? playlist;

  LoadedPlaylistByIdState({
    this.playlist,
  });
}