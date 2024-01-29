import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/models/album/album_detail.dart';
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
}
