import 'package:strongtify_mobile_app/models/user/user.dart';
import 'package:strongtify_mobile_app/utils/enums.dart';

class Playlist {
  Playlist({
    required this.id,
    required this.name,
    required this.alias,
    required this.user,
    this.imageUrl,
    this.likeCount = 0,
    this.songCount = 0,
    this.totalLength = 0,
    this.status = PlaylistStatus.public,
  });

  final String id;
  final String name;
  final String alias;
  final String? imageUrl;
  final int likeCount;
  final int songCount;
  final int totalLength;
  final PlaylistStatus status;
  final User user;

  factory Playlist.fromMap(Map<String, dynamic> data) {
    return Playlist(
      id: data['id'],
      name: data['name'],
      alias: data['alias'],
      imageUrl: data['imageUrl'],
      user: User.fromMap(data['user']),
      likeCount: data['likeCount'] ?? 0,
      songCount: data['songCount'] ?? 0,
      totalLength: data['totalLength'] ?? 0,
      status: data['status'] == 'PUBLIC' ? PlaylistStatus.public : PlaylistStatus.private
    );
  }
}
