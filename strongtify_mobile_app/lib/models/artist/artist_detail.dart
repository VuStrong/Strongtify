import 'package:strongtify_mobile_app/models/album/album.dart';
import 'package:strongtify_mobile_app/models/artist/artist.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';

class ArtistDetail extends Artist {
  ArtistDetail({
    required super.id,
    required super.name,
    required super.alias,
    super.imageUrl,
    super.followerCount = 0,
    required this.createdAt,
    this.birthDate,
    this.about,
    this.songCount = 0,
    this.albumCount = 0,
    this.songs,
    this.albums,
  });

  final DateTime createdAt;
  final DateTime? birthDate;
  final String? about;
  final int songCount;
  final int albumCount;
  final List<Song>? songs;
  final List<Album>? albums;

  factory ArtistDetail.fromMap(Map<String, dynamic> data) {
    return ArtistDetail(
      id: data['id'],
      name: data['name'],
      alias: data['alias'],
      imageUrl: data['imageUrl'],
      followerCount: data['followerCount'] ?? 0,
      createdAt: DateTime.parse(data['createdAt']),
      birthDate:
          data['birthDate'] != null ? DateTime.parse(data['birthDate']) : null,
      about: data['about'],
      songCount: data['songCount'],
      albumCount: data['albumCount'],
      songs: data['songs'] != null
          ? (data['songs'] as List).map((e) => Song.fromMap(e)).toList()
          : null,
      albums: data['albums'] != null
          ? (data['albums'] as List).map((e) => Album.fromMap(e)).toList()
          : null,
    );
  }
}
