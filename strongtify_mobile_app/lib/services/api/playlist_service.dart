import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/exceptions/base_exception.dart';
import 'package:strongtify_mobile_app/models/api_responses/paged_response.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist_detail.dart';
import 'package:strongtify_mobile_app/services/api/api_service.dart';
import 'package:strongtify_mobile_app/utils/enums.dart';

@injectable
class PlaylistService extends ApiService {
  PlaylistService(super.dioClient);

  Future<PagedResponse<Playlist>> getPlaylists({
    String? userId,
    String? keyword,
    int skip = 0,
    int take = 5,
    String? sort,
  }) async {
    try {
      Response response = await dioClient.dio.get(
        '/v1/playlists',
        queryParameters: {
          if (userId != null) 'userId': userId,
          if (keyword != null) 'q': keyword,
          if (sort != null) 'sort': sort,
          'skip': skip,
          'take': take,
        },
      );

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return PagedResponse(
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

  Future<PlaylistDetail?> getPlaylistById(String id) async {
    try {
      Response response = await dioClient.dio.get('/v1/playlists/$id');

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return PlaylistDetail.fromMap(data);
    } on DioException {
      return null;
    }
  }

  Future<void> createPlaylist({
    required String name,
    required PlaylistStatus status,
    String? description,
    File? image,
  }) async {
    final formData = FormData.fromMap({
      'name': name,
      'status': status.name.toUpperCase(),
      if (description != null) 'description': description,
      if (image != null) 'image': await MultipartFile.fromFile(image.path),
    });

    try {
      await dioClient.dio.post('/v1/playlists', data: formData);
    } on DioException {
      throw Exception();
    }
  }

  Future<PlaylistDetail> editPlaylist(
    String id, {
    required String name,
    required PlaylistStatus status,
    String? description,
    File? image,
  }) async {
    final formData = FormData.fromMap({
      'name': name,
      'status': status.name.toUpperCase(),
      if (description != null) 'description': description,
      if (image != null) 'image': await MultipartFile.fromFile(image.path),
    });

    try {
      await dioClient.dio.put('/v1/playlists/$id', data: formData);

      return (await getPlaylistById(id))!;
    } on DioException {
      throw Exception();
    }
  }

  Future<void> deletePlaylist(String id) async {
    try {
      await dioClient.dio.delete('/v1/playlists/$id');
    } on DioException {
      throw Exception();
    }
  }

  Future<void> addSongToPlaylist(String playlistId, String songId) async {
    final body = jsonEncode({
      'songIds': [songId]
    });

    try {
      await dioClient.dio.post('/v1/playlists/$playlistId/songs', data: body);
    } on DioException catch (e) {
      if (e.response != null) {
        throw BaseException(message: e.response?.data['message']);
      }

      throw Exception();
    }
  }

  Future<void> removeSongFromPlaylist(String playlistId, String songId) async {
    try {
      await dioClient.dio.delete('/v1/playlists/$playlistId/songs/$songId');
    } on DioException catch (e) {
      if (e.response != null) {
        throw BaseException(message: e.response?.data['message']);
      }

      throw Exception();
    }
  }

  Future<void> changeSongsOrder(
    String playlistId, List<String> songIds,
  ) async {
    final body = jsonEncode({'songIds': songIds});

    try {
      await dioClient.dio.put(
        '/v1/playlists/$playlistId/songs/order',
        data: body,
      );
    } on DioException {
      //
    }
  }
}
