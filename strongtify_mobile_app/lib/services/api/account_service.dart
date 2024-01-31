import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/exceptions/user_exceptions.dart';
import 'package:strongtify_mobile_app/models/account/account.dart';
import 'package:strongtify_mobile_app/models/album/album.dart';
import 'package:strongtify_mobile_app/models/api_responses/paged_response.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/services/api/api_service.dart';

@injectable
class AccountService extends ApiService {
  AccountService(super.dioClient);

  Future<Account?> getCurrentAccount() async {
    try {
      Response response = await dioClient.dio.get('/v1/me');

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return Account.fromMap(data);
    } on DioException catch (e) {
      throw UserNotFoundException(message: e.response?.data['message']);
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
}
