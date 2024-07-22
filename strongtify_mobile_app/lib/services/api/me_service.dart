import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/exceptions/auth_exceptions.dart';
import 'package:strongtify_mobile_app/exceptions/user_exceptions.dart';
import 'package:strongtify_mobile_app/models/account/account.dart';
import 'package:strongtify_mobile_app/models/album/album.dart';
import 'package:strongtify_mobile_app/models/api_responses/paged_response.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/models/user_favs.dart';
import 'package:strongtify_mobile_app/services/api/api_service.dart';
import 'package:strongtify_mobile_app/services/local_storage/local_storage.dart';

@injectable
class MeService extends ApiService {
  MeService(super.dioClient, this._storage);

  final LocalStorage _storage;

  Future<Account?> getCurrentAccount() async {
    try {
      Response response = await dioClient.dio.get('/v1/me');

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return Account.fromMap(data);
    } on DioException catch (e) {
      throw UserNotFoundException(message: e.response?.data['message']);
    }
  }

  Future<Account> editAccount({
    String? name,
    String? about,
    File? image,
  }) async {
    final formData = FormData.fromMap({
      if (name != null) 'name': name,
      if (about != null) 'about': about,
      if (image != null) 'image': await MultipartFile.fromFile(image.path),
    });

    try {
      Response response = await dioClient.dio.patch('/v1/me', data: formData);

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return Account.fromMap(data);
    } on DioException {
      throw Exception();
    }
  }

  Future<void> changePassword({
    required String oldPassword,
    required String newPassword,
  }) async {
    final body = jsonEncode({
      'oldPassword': oldPassword,
      'newPassword': newPassword,
    });

    try {
      await dioClient.dio.patch('/v1/me/password', data: body);
    } on DioException catch (e) {
      if (e.response?.statusCode == 400) {
        throw PasswordNotMatchException();
      }

      throw Exception();
    }
  }

  Future<PagedResponse<Song>> getLikedSongs({
    int skip = 0,
    int take = 10,
  }) async {
    try {
      Response response = await dioClient.dio.get(
        '/v1/me/liked-songs',
        queryParameters: {
          'skip': skip,
          'take': take,
        },
      );

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return PagedResponse<Song>(
        items: (data['results'] as List).map((e) => Song.fromMap(e)).toList(),
        total: data['total'],
        skip: data['skip'],
        take: data['take'],
        end: data['end'],
      );
    } on DioException {
      throw Exception();
    }
  }

  Future<PagedResponse<Album>> getLikedAlbums({
    int skip = 0,
    int take = 5,
  }) async {
    try {
      Response response = await dioClient.dio.get(
        '/v1/me/liked-albums',
        queryParameters: {
          'skip': skip,
          'take': take,
        },
      );

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return PagedResponse<Album>(
        items: (data['results'] as List).map((e) => Album.fromMap(e)).toList(),
        total: data['total'],
        skip: data['skip'],
        take: data['take'],
        end: data['end'],
      );
    } on DioException {
      throw Exception();
    }
  }

  Future<bool> checkLikedAlbum(String albumId) async {
    try {
      await dioClient.dio.head('/v1/me/liked-albums/$albumId');

      return true;
    } on DioException {
      return false;
    }
  }

  Future<void> likeAlbum(String albumId) async {
    try {
      await dioClient.dio.post(
        '/v1/me/liked-albums',
        data: jsonEncode({'albumId': albumId}),
      );
    } on DioException {
      //
    }
  }

  Future<void> unlikeAlbum(String albumId) async {
    try {
      await dioClient.dio.delete('/v1/me/liked-albums/$albumId');
    } on DioException {
      //
    }
  }

  Future<bool> checkLikedSong(String songId) async {
    try {
      await dioClient.dio.head('/v1/me/liked-songs/$songId');

      return true;
    } on DioException {
      return false;
    }
  }

  Future<void> likeSong(String songId) async {
    try {
      await dioClient.dio.post(
        '/v1/me/liked-songs',
        data: jsonEncode({'songId': songId}),
      );
    } on DioException {
      //
    }
  }

  Future<void> unlikeSong(String songId) async {
    try {
      await dioClient.dio.delete('/v1/me/liked-songs/$songId');
    } on DioException {
      //
    }
  }

  Future<bool> checkLikedPlaylist(String playlistId) async {
    try {
      await dioClient.dio.head('/v1/me/liked-playlists/$playlistId');

      return true;
    } on DioException {
      return false;
    }
  }

  Future<void> likePlaylist(String playlistId) async {
    try {
      await dioClient.dio.post(
        '/v1/me/liked-playlists',
        data: jsonEncode({'playlistId': playlistId}),
      );
    } on DioException {
      //
    }
  }

  Future<void> unlikePlaylist(String playlistId) async {
    try {
      await dioClient.dio.delete('/v1/me/liked-playlists/$playlistId');
    } on DioException {
      //
    }
  }

  Future<PagedResponse<Playlist>> getLikedPlaylists({
    int skip = 0,
    int take = 5,
  }) async {
    try {
      Response response = await dioClient.dio.get(
        '/v1/me/liked-playlists',
        queryParameters: {
          'skip': skip,
          'take': take,
        },
      );

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return PagedResponse<Playlist>(
        items:
            (data['results'] as List).map((e) => Playlist.fromMap(e)).toList(),
        total: data['total'],
        skip: data['skip'],
        take: data['take'],
        end: data['end'],
      );
    } on DioException {
      throw Exception();
    }
  }

  Future<void> followUser(String userId) async {
    try {
      await dioClient.dio.post(
        '/v1/me/following-users',
        data: jsonEncode({'idToFollow': userId}),
      );
    } on DioException {
      //
    }
  }

  Future<void> unfollowUser(String userId) async {
    try {
      await dioClient.dio.delete('/v1/me/following-users/$userId');
    } on DioException {
      //
    }
  }

  Future<void> followArtist(String artistId) async {
    try {
      await dioClient.dio.post(
        '/v1/me/following-artists',
        data: jsonEncode({'artistId': artistId}),
      );
    } on DioException {
      //
    }
  }

  Future<void> unfollowArtist(String artistId) async {
    try {
      await dioClient.dio.delete('/v1/me/following-artists/$artistId');
    } on DioException {
      //
    }
  }

  Future<bool> checkFollowingUser(String userIdToCheck) async {
    final userId = await _storage.getString('user_id');

    try {
      await dioClient.dio
          .head('/v1/users/$userId/following-users/$userIdToCheck');

      return true;
    } on DioException {
      return false;
    }
  }

  Future<bool> checkFollowingArtist(String artistId) async {
    final userId = await _storage.getString('user_id');

    try {
      await dioClient.dio.head('/v1/users/$userId/following-artists/$artistId');

      return true;
    } on DioException {
      return false;
    }
  }

  Future<UserFavs> getFavs() async {
    try {
      Response response = await dioClient.dio.get('/v1/me/fav-ids');

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return UserFavs(
        likedSongIds:
            (data['songIds'] as List).map((e) => e.toString()).toSet(),
        likedAlbumIds:
            (data['albumIds'] as List).map((e) => e.toString()).toSet(),
        likedPlaylistIds:
            (data['playlistIds'] as List).map((e) => e.toString()).toSet(),
        followingArtistIds:
            (data['artistIds'] as List).map((e) => e.toString()).toSet(),
        followingUserIds:
            (data['userIds'] as List).map((e) => e.toString()).toSet(),
      );
    } on DioException {
      throw Exception();
    }
  }

  Future<PagedResponse<Song>> getListenHistory({
    int skip = 0,
    int take = 10,
  }) async {
    try {
      Response response = await dioClient.dio.get(
        '/v1/me/history',
        queryParameters: {
          'skip': skip,
          'take': take,
        },
      );

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return PagedResponse<Song>(
        items: (data['results'] as List).map((e) => Song.fromMap(e)).toList(),
        total: data['total'],
        skip: data['skip'],
        take: data['take'],
        end: data['end'],
      );
    } on DioException {
      throw Exception();
    }
  }

  Future<void> removeListenHistory(String songId) async {
    try {
      await dioClient.dio.delete('/v1/me/history/$songId');
    } on DioException {
      //
    }
  }
}
