import 'package:strongtify_mobile_app/models/song/song.dart';

abstract class PlayerEvent {}

class CreatePlayerEvent extends PlayerEvent {
  final List<Song> songs;
  final int index;

  CreatePlayerEvent({
    required this.songs,
    this.index = 0,
  });
}

class SkipToEvent extends PlayPlayerEvent {
  final int index;

  SkipToEvent({
    required this.index,
  });
}

class PlayPlayerEvent extends PlayerEvent {}

class PausePlayerEvent extends PlayerEvent {}
