import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/dio/dio_client.dart';
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
      Response response = await dioClient.dio.get('/v1/songs/top-songs',
          queryParameters: {'time': time.name});

      return (response.data as List).map((e) => Song.fromMap(e)).toList();
    } on DioException {
      return [];
    }
  }
}
