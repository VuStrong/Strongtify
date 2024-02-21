import 'package:strongtify_mobile_app/models/song/song.dart';

enum PlayerStatus {
  ready,
  playing,
  idle,
}

class PlayerState {
  List<Song>? songs;
  int currentIndex;
  Song? playingSong;
  PlayerStatus status;

  PlayerState({
    this.songs,
    this.currentIndex = 0,
    this.playingSong,
    this.status = PlayerStatus.idle,
  });

  PlayerState copyWith({
    List<Song>? Function()? songs,
    int? currentIndex,
    Song? Function()? playingSong,
    PlayerStatus? status,
  }) {
    return PlayerState(
      songs: songs != null ? songs() : this.songs,
      currentIndex: currentIndex ?? this.currentIndex,
      playingSong: playingSong != null ? playingSong() : this.playingSong,
      status: status ?? this.status,
    );
  }
}
