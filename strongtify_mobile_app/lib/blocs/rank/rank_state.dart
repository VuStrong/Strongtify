import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/utils/enums.dart';

enum RankStatus {
  loading,
  loaded,
}

class RankState {
  final RankTime time;
  final List<Song> songs;
  final RankStatus status;

  RankState({
    required this.songs,
    required this.time,
    required this.status,
  });

  factory RankState.init() {
    return RankState(
      time: RankTime.day,
      songs: [],
      status: RankStatus.loading,
    );
  }
}
