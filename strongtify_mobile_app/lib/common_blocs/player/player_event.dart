import 'package:strongtify_mobile_app/models/song/song.dart';

abstract class PlayerEvent {}

class CreatePlayerEvent extends PlayerEvent {
  final List<Song> songs;
  final int index;
  final String? playlistId;

  CreatePlayerEvent({
    required this.songs,
    this.index = 0,
    this.playlistId,
  });
}

class PlayPlayerEvent extends PlayerEvent {
  final bool onlyUpdateState;

  PlayPlayerEvent({this.onlyUpdateState = false});
}

class PausePlayerEvent extends PlayerEvent {
  final bool onlyUpdateState;

  PausePlayerEvent({this.onlyUpdateState = false});
}

class SkipToPreviousEvent extends PlayerEvent {}

class SkipToNextEvent extends PlayerEvent {}

class SeekToEvent extends PlayerEvent {
  final Duration duration;

  SeekToEvent({this.duration = Duration.zero});
}
