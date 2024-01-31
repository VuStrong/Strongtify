import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/models/api_responses/paged_response.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist_detail.dart';
import 'package:strongtify_mobile_app/services/api/api_service.dart';

@injectable
class PlaylistService extends ApiService {
  PlaylistService(super.dioClient);

  Future<PagedResponse<Playlist>?> getPlaylists({
    String? userId,
    int skip = 0,
    int take = 5,
    String? sort,
  }) async {
    try {
      Response response = await dioClient.dio.get(
        '/v1/playlists',
        queryParameters: {
          if (userId != null) 'userId': userId,
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
      return null;
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
}
