import 'package:strongtify_mobile_app/models/playlist/playlist.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/models/user/user.dart';
import 'package:strongtify_mobile_app/utils/enums.dart';

class PlaylistDetail extends Playlist {
  PlaylistDetail({
    required super.id,
    required super.name,
    required super.alias,
    required super.user,
    super.imageUrl,
    super.likeCount = 0,
    super.songCount = 0,
    super.totalLength = 0,
    super.status = PlaylistStatus.public,
    required this.createdAt,
    this.description,
    this.songs,
  });

  final DateTime createdAt;
  final String? description;
  final List<Song>? songs;

  factory PlaylistDetail.fromMap(Map<String, dynamic> data) {
    return PlaylistDetail(
      id: data['id'],
      name: data['name'],
      alias: data['alias'],
      imageUrl: data['imageUrl'],
      user: User.fromMap(data['user']),
      likeCount: data['likeCount'] ?? 0,
      songCount: data['songCount'] ?? 0,
      totalLength: data['totalLength'] ?? 0,
      status: data['status'] == 'PUBLIC'
          ? PlaylistStatus.public
          : PlaylistStatus.private,
      createdAt: DateTime.parse(data['createdAt']),
      description: data['description'],
      songs: data['songs'] != null
          ? (data['songs'] as List).map((e) => Song.fromMap(e)).toList()
          : null,
    );
  }
}
