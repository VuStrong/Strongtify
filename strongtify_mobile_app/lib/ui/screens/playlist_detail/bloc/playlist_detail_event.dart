import 'dart:io';

import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/utils/enums.dart';

abstract class PlaylistDetailEvent {}

class GetPlaylistByIdEvent extends PlaylistDetailEvent {
  final String id;

  GetPlaylistByIdEvent({required this.id});
}

class EditPlaylistEvent extends PlaylistDetailEvent {
  final String playlistId;
  final String name;
  final String? description;
  final PlaylistStatus status;
  final File? image;

  EditPlaylistEvent({
    required this.playlistId,
    required this.name,
    required this.status,
    this.description,
    this.image,
  });
}

class DeletePlaylistEvent extends PlaylistDetailEvent {
  final String playlistId;

  DeletePlaylistEvent({
    required this.playlistId,
  });
}

class AddSongToPlaylistStateEvent extends PlaylistDetailEvent {
  final Song song;

  AddSongToPlaylistStateEvent({
    required this.song,
  });
}

class RemoveSongFromPlaylistStateEvent extends PlaylistDetailEvent {
  final String songId;

  RemoveSongFromPlaylistStateEvent({
    required this.songId,
  });
}

class MoveSongInPlaylistEvent extends PlaylistDetailEvent {
  final int from;
  final int to;

  MoveSongInPlaylistEvent({
    required this.from,
    required this.to,
  });
}