import 'package:strongtify_mobile_app/models/artist/artist.dart';

class Song {
  Song(
      {required this.id,
      required this.name,
      required this.alias,
      this.imageUrl,
      this.songUrl,
      this.likeCount = 0,
      this.listenCount = 0,
      this.length = 0,
      this.language = 'NONE',
      this.releasedAt,
      this.artists});

  final String id;
  final String name;
  final String alias;
  final String? imageUrl;
  final String? songUrl;
  final int likeCount;
  final int listenCount;
  final int length;
  final String language;
  final DateTime? releasedAt;
  final List<Artist>? artists;

  factory Song.fromMap(Map<String, dynamic> data) {
    return Song(
      id: data['id'],
      name: data['name'],
      alias: data['alias'],
      imageUrl: data['imageUrl'],
      songUrl: data['songUrl'],
      likeCount: data['likeCount'] ?? 0,
      listenCount: data['listenCount'] ?? 0,
      length: data['length'] ?? 0,
      language: data['language'],
      releasedAt:
          data['releasedAt'] != null ? DateTime.parse(data['releasedAt']) : null,
      artists: data['artists'] != null
          ? (data['artists'] as List).map((e) => Artist.fromMap(e)).toList()
          : null,
    );
  }
}
