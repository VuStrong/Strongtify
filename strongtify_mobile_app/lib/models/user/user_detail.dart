import 'package:strongtify_mobile_app/models/artist/artist.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist.dart';
import 'package:strongtify_mobile_app/models/user/user.dart';

class UserDetail extends User {
  UserDetail({
    required super.id,
    required super.name,
    required super.alias,
    super.imageUrl,
    super.followerCount = 0,
    required this.createdAt,
    this.about,
    this.playlistCount = 0,
    this.followingUserCount = 0,
    this.followingArtistCount = 0,
    this.followings,
    this.followers,
    this.followingArtists,
    this.playlists,
  });

  final DateTime createdAt;
  String? about;
  final int playlistCount;
  final int followingUserCount;
  final int followingArtistCount;
  final List<User>? followings;
  final List<User>? followers;
  final List<Artist>? followingArtists;
  final List<Playlist>? playlists;

  factory UserDetail.fromMap(Map<String, dynamic> data) {
    return UserDetail(
      id: data['id'],
      name: data['name'],
      alias: data['alias'] ?? '',
      imageUrl: data['imageUrl'],
      followerCount: data['followerCount'] ?? 0,
      createdAt: DateTime.parse(data['createdAt']),
      about: data['about'],
      playlistCount: data['playlistCount'] ?? 0,
      followingUserCount: data['followingUserCount'] ?? 0,
      followingArtistCount: data['followingArtistCount'] ?? 0,
      followings: data['followings'] != null
          ? (data['followings'] as List).map((e) => User.fromMap(e)).toList()
          : null,
      followers: data['followers'] != null
          ? (data['followers'] as List).map((e) => User.fromMap(e)).toList()
          : null,
      followingArtists: data['followingArtists'] != null
          ? (data['followingArtists'] as List)
              .map((e) => Artist.fromMap(e))
              .toList()
          : null,
      playlists: data['playlists'] != null
          ? (data['playlists'] as List).map((e) => Playlist.fromMap(e)).toList()
          : null,
    );
  }
}
