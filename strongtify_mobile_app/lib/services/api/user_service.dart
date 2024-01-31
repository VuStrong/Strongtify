import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/models/user/user_detail.dart';
import 'package:strongtify_mobile_app/services/api/api_service.dart';

@injectable
class UserService extends ApiService {
  UserService(super.dioClient);

  Future<UserDetail?> getUserById(String id) async {
    try {
      Response response = await dioClient.dio.get(
        '/v1/users/$id',
        queryParameters: {
          'playlistLimit': 5,
          'followingUserLimit': 5,
          'followerLimit': 5,
        },
      );

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return UserDetail.fromMap(data);
    } on DioException {
      return null;
    }
  }
}
