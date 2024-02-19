import 'package:strongtify_mobile_app/models/song/song.dart';

abstract class PlaylistSongsEvent {}

class AddSongToPlaylistEvent extends PlaylistSongsEvent {
  final String playlistId;
  final Song song;

  AddSongToPlaylistEvent({
    required this.playlistId,
    required this.song,
  });
}

class RemoveSongFromPlaylistEvent extends PlaylistSongsEvent {
  final String playlistId;
  final String songId;

  RemoveSongFromPlaylistEvent({
    required this.playlistId,
    required this.songId,
  });
}
