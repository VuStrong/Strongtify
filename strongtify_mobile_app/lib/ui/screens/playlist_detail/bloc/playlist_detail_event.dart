import 'dart:io';

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