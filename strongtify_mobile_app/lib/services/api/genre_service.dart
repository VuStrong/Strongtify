import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/dio/dio_client.dart';
import 'package:strongtify_mobile_app/models/genre/genre.dart';
import 'package:strongtify_mobile_app/services/api/api_service.dart';

@injectable
class GenreService extends ApiService {
  GenreService(DioClient dioClient) : super(dioClient);

  Future<List<Genre>> getAllGenres() async {
    try {
      Response response = await dioClient.dio
          .get('/v1/genres', queryParameters: {'take': 100});

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return (data['results'] as List).map((e) => Genre.fromMap(e)).toList();
    } on DioException {
      return [];
    }
  }
}
