import 'dart:io';

import 'package:strongtify_mobile_app/utils/enums.dart';

class CreatePlaylistEvent {
  final String name;
  final String? description;
  final PlaylistStatus status;
  final File? image;

  CreatePlaylistEvent({
    required this.name,
    required this.status,
    this.description,
    this.image,
  });
}