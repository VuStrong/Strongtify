import 'package:strongtify_mobile_app/models/album/album.dart';
import 'package:strongtify_mobile_app/models/genre/genre.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';

class GenreDetail extends Genre {
  GenreDetail({
    required super.id,
    required super.name,
    required super.alias,
    super.imageUrl,
    this.description,
    required this.createdAt,
    required this.updatedAt,
    this.songs,
    this.albums,
  });

  final String? description;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<Song>? songs;
  final List<Album>? albums;

  factory GenreDetail.fromMap(Map<String, dynamic> data) {
    return GenreDetail(
      id: data['id'],
      name: data['name'],
      alias: data['alias'],
      imageUrl: data['imageUrl'],
      description: data['description'],
      createdAt: DateTime.parse(data['createdAt']),
      updatedAt: DateTime.parse(data['updatedAt']),
      songs: data['songs'] != null
          ? (data['songs'] as List).map((e) => Song.fromMap(e)).toList()
          : null,
      albums: data['albums'] != null
          ? (data['albums'] as List).map((e) => Album.fromMap(e)).toList()
          : null,
    );
  }
}
