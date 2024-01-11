import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/dio/dio_client.dart';
import 'package:strongtify_mobile_app/exceptions/auth_exception.dart';
import 'package:strongtify_mobile_app/models/account/account.dart';
import 'package:strongtify_mobile_app/services/api_service.dart';

@injectable
class AuthService extends ApiService {
  AuthService(DioClient dioClient) : super(dioClient);

  Future<Account> login(String email, String password) async {
    String body = jsonEncode({
      'password': password,
      'email': email,
    });

    try {
      Response response = await dioClient.dio.post('/v1/auth/login', data: body);

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      await _saveToken(data);

      return Account.fromJson(data['user']);
    } on DioException catch (e) {
      if (e.response!.statusCode == 400) {
        throw WrongCredentialException(message: e.response!.data['message']);
      }

      throw Exception(e.message);
    }
  }

  Future<void> _saveToken(Map<String, dynamic> data) async {
    const storage = FlutterSecureStorage();

    await storage.write(key: 'access_token', value: data['access_token']);
    await storage.write(key: 'refresh_token', value: data['refresh_token']);

    DateTime expiredAt = DateTime.now().add(const Duration(minutes: 25));
    await storage.write(key: 'access_token_expired_at', value: expiredAt.toString());
  }
}