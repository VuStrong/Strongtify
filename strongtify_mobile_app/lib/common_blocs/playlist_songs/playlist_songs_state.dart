import 'package:strongtify_mobile_app/models/song/song.dart';

enum PlaylistSongsStatus {
  pending,
  adding,
  added,
  removing,
  removed,
  error,
}

class PlaylistSongsState {
  PlaylistSongsState({
    this.status = PlaylistSongsStatus.pending,
    this.errorMessage,
    this.addedSong,
    this.removedSongId,
  });

  final PlaylistSongsStatus status;
  final String? errorMessage;
  final String? removedSongId;
  final Song? addedSong;
}