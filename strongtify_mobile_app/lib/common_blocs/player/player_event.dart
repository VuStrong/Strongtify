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

class MoveSongInQueueEvent extends PlayerEvent {
  final int from;
  final int to;

  MoveSongInQueueEvent({
    required this.from,
    required this.to,
  });
}

class AddSongToQueueEvent extends PlayerEvent {
  final Song song;

  AddSongToQueueEvent({
    required this.song,
  });
}

class RemoveSongFromQueueEvent extends PlayerEvent {
  final String songId;

  RemoveSongFromQueueEvent({
    required this.songId,
  });
}