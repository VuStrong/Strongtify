import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/blocs/auth/auth_bloc.dart';
import 'package:strongtify_mobile_app/blocs/auth/auth_event.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/services/local_storage/local_storage.dart';
import 'package:strongtify_mobile_app/utils/constants/app_constants.dart';

@injectable
class TokenInterceptor extends QueuedInterceptor {
  TokenInterceptor(this._storage);

  final LocalStorage _storage;

  @override
  Future<void> onRequest(
      RequestOptions options, RequestInterceptorHandler handler) async {
    String? accessToken = await _storage.getString('access_token');
    String? refreshToken = await _storage.getString('refresh_token');
    String? userId = await _storage.getString('user_id');
    DateTime? expiredAt = await _storage.getDateTime('access_token_expired_at');

    if (refreshToken == null || userId == null) {
      return handler.next(options);
    }

    bool isExpired =
        expiredAt != null ? DateTime.now().isAfter(expiredAt) : true;
    bool shouldRefresh = isExpired == true || accessToken == null;

    if (shouldRefresh) {
      try {
        String newAccessToken = await _refreshToken(refreshToken, userId);

        options.headers['Authorization'] = "Bearer $newAccessToken";
      } on DioException {
        getIt<AuthBloc>().add(AuthEventLogout());
      }

      return handler.next(options);
    } else {
      options.headers['Authorization'] = "Bearer $accessToken";
      return handler.next(options);
    }
  }

  Future<String> _refreshToken(String refreshToken, String userId) async {
    final tokenDio = Dio();
    tokenDio.options.baseUrl = dotenv.env['BACKEND_URL'] ?? '';
    String body = jsonEncode({
      'refreshToken': refreshToken,
      'userId': userId,
    });

    Response response =
        await tokenDio.post('/v1/auth/refresh-token', data: body);
    String accessToken = response.data['access_token'];

    await _storage.setString(key: 'access_token', value: accessToken);

    DateTime expiredAt = DateTime.now()
        .add(const Duration(minutes: AppConstants.accessTokenLiveTime));
    await _storage.setDateTime(
        key: 'access_token_expired_at', value: expiredAt);

    return accessToken;
  }
}
