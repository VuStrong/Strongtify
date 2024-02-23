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

  PlayerState({
    this.songs,
    this.playingSong,
    this.status = PlayerStatus.idle,
  });

  PlayerState copyWith({
    List<Song>? Function()? songs,
    Song? Function()? playingSong,
    PlayerStatus? status,
  }) {
    return PlayerState(
      songs: songs != null ? songs() : this.songs,
      playingSong: playingSong != null ? playingSong() : this.playingSong,
      status: status ?? this.status,
    );
  }
}
