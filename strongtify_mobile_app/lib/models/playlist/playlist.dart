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
    this.status = PlaylistStatus.public,
  });

  final String id;
  String name;
  final String alias;
  final String? imageUrl;
  final int likeCount;
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
      status: data['status'] == 'PUBLIC'
          ? PlaylistStatus.public
          : PlaylistStatus.private,
    );
  }
}
