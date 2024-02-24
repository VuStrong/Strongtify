import 'package:strongtify_mobile_app/models/song/song.dart';

enum PlayerStatus {
  idle,
  playing,
  paused,
}

class PlayerState {
  List<Song>? songs;
  Song? playingSong;
  PlayerStatus status;
  String? playlistId;

  PlayerState({
    this.songs,
    this.playingSong,
    this.status = PlayerStatus.idle,
    this.playlistId,
  });

  PlayerState copyWith({
    List<Song>? Function()? songs,
    Song? Function()? playingSong,
    PlayerStatus? status,
    String? Function()? playlistId,
  }) {
    return PlayerState(
      songs: songs != null ? songs() : this.songs,
      playingSong: playingSong != null ? playingSong() : this.playingSong,
      status: status ?? this.status,
      playlistId: playlistId != null ? playlistId() : this.playlistId,
    );
  }
}
