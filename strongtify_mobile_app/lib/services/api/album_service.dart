import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/models/album/album.dart';
import 'package:strongtify_mobile_app/models/album/album_detail.dart';
import 'package:strongtify_mobile_app/models/api_responses/paged_response.dart';
import 'package:strongtify_mobile_app/services/api/api_service.dart';

@injectable
class AlbumService extends ApiService {
  AlbumService(super.dioClient);

  Future<AlbumDetail?> getAlbumById(String id) async {
    try {
      Response response = await dioClient.dio.get('/v1/albums/$id');

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return AlbumDetail.fromMap(data);
    } on DioException {
      return null;
    }
  }

  Future<PagedResponse<Album>> getAlbums({
    int skip = 0,
    int take = 5,
    String? genreId,
    String? artistId,
    String? sort,
  }) async {
    try {
      Response response = await dioClient.dio.get(
        '/v1/albums',
        queryParameters: {
          'skip': skip,
          'take': take,
          if (genreId != null) 'genreId': genreId,
          if (artistId != null) 'artistId': artistId,
          if (sort != null) 'sort': sort,
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
}
