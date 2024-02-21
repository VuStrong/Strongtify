import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/dio/dio_client.dart';
import 'package:strongtify_mobile_app/models/api_responses/paged_response.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/services/api/api_service.dart';
import 'package:strongtify_mobile_app/utils/enums.dart';

@injectable
class SongService extends ApiService {
  SongService(DioClient dioClient) : super(dioClient);

  Future<List<Song>> getTopSongs({
    required RankTime time,
  }) async {
    try {
      Response response = await dioClient.dio
          .get('/v1/songs/top-songs', queryParameters: {'time': time.name});

      return (response.data as List).map((e) => Song.fromMap(e)).toList();
    } on DioException {
      return [];
    }
  }

  Future<PagedResponse<Song>> getSongs({
    int skip = 0,
    int take = 5,
    String? genreId,
    String? artistId,
    String? sort,
  }) async {
    try {
      Response response = await dioClient.dio.get(
        '/v1/songs',
        queryParameters: {
          'skip': skip,
          'take': take,
          if (genreId != null) 'genreId': genreId,
          if (artistId != null) 'artistId': artistId,
          if (sort != null) 'sort': sort,
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

  Future<Song?> getSongById(String id) async {
    try {
      Response response = await dioClient.dio.get('/v1/songs/$id');

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return Song.fromMap(data);
    } on DioException {
      return null;
    }
  }
}
