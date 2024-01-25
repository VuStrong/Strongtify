import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/utils/enums.dart';

abstract class RankState {}

class LoadingRankState extends RankState {}

class LoadedRankState extends RankState {
  final RankTime time;
  final List<Song> songs;

  LoadedRankState({
    required this.songs,
    required this.time
  });
}