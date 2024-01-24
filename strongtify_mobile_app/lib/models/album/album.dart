import 'package:strongtify_mobile_app/models/artist/artist.dart';

class Album {
  Album({
    required this.id,
    required this.name,
    required this.alias,
    this.imageUrl,
    this.likeCount = 0,
    this.songCount = 0,
    this.totalLength = 0,
    this.artist,
  });

  final String id;
  final String name;
  final String alias;
  final String? imageUrl;
  final int likeCount;
  final int songCount;
  final int totalLength;
  final Artist? artist;

  factory Album.fromMap(Map<String, dynamic> data) {
    return Album(
      id: data['id'],
      name: data['name'],
      alias: data['alias'],
      imageUrl: data['imageUrl'],
      likeCount: data['likeCount'] ?? 0,
      songCount: data['likeCount'] ?? 0,
      totalLength: data['likeCount'] ?? 0,
      artist: data['artist'] != null ? Artist.fromMap(data['artist']) : null,
    );
  }
}
