import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/models/api_responses/paged_response.dart';
import 'package:strongtify_mobile_app/models/artist/artist.dart';
import 'package:strongtify_mobile_app/models/user/user.dart';
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

  Future<PagedResponse<User>> getFollowingUsers(
    String userId, {
    int skip = 0,
    int take = 10,
  }) async {
    try {
      Response response = await dioClient.dio.get(
        '/v1/users/$userId/following-users',
        queryParameters: {
          'skip': skip,
          'take': take,
        },
      );

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return PagedResponse(
        items: (data['results'] as List).map((e) => User.fromMap(e)).toList(),
        total: data['total'],
        skip: data['skip'],
        take: data['take'],
        end: data['end'],
      );
    } on DioException {
      throw Exception();
    }
  }

  Future<PagedResponse<User>> getFollowers(
    String userId, {
    int skip = 0,
    int take = 10,
  }) async {
    try {
      Response response = await dioClient.dio.get(
        '/v1/users/$userId/followers',
        queryParameters: {
          'skip': skip,
          'take': take,
        },
      );

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return PagedResponse(
        items: (data['results'] as List).map((e) => User.fromMap(e)).toList(),
        total: data['total'],
        skip: data['skip'],
        take: data['take'],
        end: data['end'],
      );
    } on DioException {
      throw Exception();
    }
  }

  Future<PagedResponse<Artist>> getFollowingArtists(
    String userId, {
    int skip = 0,
    int take = 10,
  }) async {
    try {
      Response response = await dioClient.dio.get(
        '/v1/users/$userId/following-artists',
        queryParameters: {
          'skip': skip,
          'take': take,
        },
      );

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return PagedResponse(
        items: (data['results'] as List).map((e) => Artist.fromMap(e)).toList(),
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
