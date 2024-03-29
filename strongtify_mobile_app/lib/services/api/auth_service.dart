import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/dio/dio_client.dart';
import 'package:strongtify_mobile_app/exceptions/auth_exceptions.dart';
import 'package:strongtify_mobile_app/models/account/account.dart';
import 'package:strongtify_mobile_app/services/api/api_service.dart';
import 'package:strongtify_mobile_app/services/local_storage/local_storage.dart';
import 'package:strongtify_mobile_app/utils/constants/app_constants.dart';

@injectable
class AuthService extends ApiService {
  final LocalStorage _storage;

  AuthService(DioClient dioClient, this._storage) : super(dioClient);

  Future<Account> login(String email, String password) async {
    String body = jsonEncode({
      'password': password,
      'email': email,
    });

    try {
      Response response =
          await dioClient.dio.post('/v1/auth/login', data: body);

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      await _saveTokens(data);

      return Account.fromMap(data['user']);
    } on DioException catch (e) {
      if (e.response?.statusCode == 400) {
        throw WrongCredentialException(message: e.response?.data['message']);
      }
      if (e.response?.statusCode == 403) {
        throw UserIsLockedOutException(message: e.response?.data['message']);
      }

      throw Exception(e.message);
    }
  }

  Future<Account> register({
    required String name,
    required String email,
    required String password,
  }) async {
    String body = jsonEncode({
      'password': password,
      'email': email,
      'name': name,
    });

    try {
      Response response =
          await dioClient.dio.post('/v1/auth/register', data: body);

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      await _saveTokens(data);

      return Account.fromMap(data['user']);
    } on DioException catch (e) {
      if (e.response?.statusCode == 400) {
        throw EmailAlreadyExistsException(message: e.response?.data['message']);
      }

      throw Exception(e.message);
    }
  }

  Future<void> sendEmailConfirmation() async {
    try {
      Response response =
          await dioClient.dio.post('/v1/auth/confirm-email-link');
    } on DioException catch (e) {
      throw Exception(e.message);
    }
  }

  Future<void> sendPasswordResetLink(String email) async {
    String body = jsonEncode({
      'email': email,
    });

    try {
      Response response =
          await dioClient.dio.post('/v1/auth/reset-password-link', data: body);
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) {
        throw EmailNotFoundException(message: e.response?.data['message']);
      }

      throw Exception(e.message);
    }
  }

  Future<void> _saveTokens(Map<String, dynamic> data) async {
    await _storage.setString(key: 'access_token', value: data['access_token']);
    await _storage.setString(
        key: 'refresh_token', value: data['refresh_token']);
    await _storage.setString(key: 'user_id', value: data['user']['id']);

    DateTime expiredAt = DateTime.now()
        .add(const Duration(minutes: AppConstants.accessTokenLiveTime));
    await _storage.setDateTime(
        key: 'access_token_expired_at', value: expiredAt);
  }
}
