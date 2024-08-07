import 'package:strongtify_mobile_app/models/artist/artist.dart';

class Album {
  Album({
    required this.id,
    required this.name,
    required this.alias,
    this.imageUrl,
    this.likeCount = 0,
    this.artist,
  });

  final String id;
  final String name;
  final String alias;
  final String? imageUrl;
  final int likeCount;
  final Artist? artist;

  factory Album.fromMap(Map<String, dynamic> data) {
    return Album(
      id: data['id'],
      name: data['name'],
      alias: data['alias'],
      imageUrl: data['imageUrl'],
      likeCount: data['likeCount'] ?? 0,
      artist: data['artist'] != null ? Artist.fromMap(data['artist']) : null,
    );
  }
}
