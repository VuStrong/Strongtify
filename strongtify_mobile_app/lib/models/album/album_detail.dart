import 'package:strongtify_mobile_app/models/album/album.dart';
import 'package:strongtify_mobile_app/models/artist/artist.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';

class AlbumDetail extends Album {
  AlbumDetail({
    required super.id,
    required super.name,
    required super.alias,
    this.songCount = 0,
    this.totalLength = 0,
    super.imageUrl,
    super.likeCount = 0,
    super.artist,
    required this.createdAt,
    this.songs,
  });

  final int songCount;
  final int totalLength;
  final DateTime createdAt;
  final List<Song>? songs;

  factory AlbumDetail.fromMap(Map<String, dynamic> data) {
    return AlbumDetail(
      id: data['id'],
      name: data['name'],
      alias: data['alias'],
      imageUrl: data['imageUrl'],
      likeCount: data['likeCount'] ?? 0,
      songCount: data['songCount'] ?? 0,
      totalLength: data['totalLength'] ?? 0,
      artist: data['artist'] != null ? Artist.fromMap(data['artist']) : null,
      createdAt: DateTime.parse(data['createdAt']),
      songs: data['songs'] != null
          ? (data['songs'] as List).map((e) => Song.fromMap(e)).toList()
          : null,
    );
  }


}