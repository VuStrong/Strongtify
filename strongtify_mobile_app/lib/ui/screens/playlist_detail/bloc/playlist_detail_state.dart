import 'package:strongtify_mobile_app/models/playlist/playlist_detail.dart';

enum PlaylistDetailStatus {
  loading,
  loaded,
  editing,
  edited,
  deleting,
  deleted,
  error,
}

class PlaylistDetailState {
  final PlaylistDetail? playlist;
  final PlaylistDetailStatus status;
  final String? errorMessage;

  PlaylistDetailState({
    this.playlist,
    this.status = PlaylistDetailStatus.loading,
    this.errorMessage,
  });

  PlaylistDetailState copyWith({
    PlaylistDetail? Function()? playlist,
    PlaylistDetailStatus? status,
    String? Function()? errorMessage,
  }) {
    return PlaylistDetailState(
      playlist: playlist != null ? playlist() : this.playlist,
      status: status ?? this.status,
      errorMessage: errorMessage != null ? errorMessage() : this.errorMessage,
    );
  }
}