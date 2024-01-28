import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/models/artist/artist_detail.dart';
import 'package:strongtify_mobile_app/services/api/api_service.dart';

@injectable
class ArtistService extends ApiService {
  ArtistService(super.dioClient);

  Future<ArtistDetail?> getArtistById(String id) async {
    try {
      Response response = await dioClient.dio.get(
        '/v1/artists/$id',
        queryParameters: {
          'songLimit': 10,
          'albumLimit': 5,
        },
      );

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return ArtistDetail.fromMap(data);
    } on DioException {
      return null;
    }
  }
}