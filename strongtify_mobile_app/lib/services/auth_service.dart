import 'dart:convert';

import 'package:dio/dio.dart';
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

      print(Account.fromJson(data['user']));

      return Account.fromJson(data['user']);
    } on DioException catch (e) {
      if (e.response!.statusCode == 400) {
        throw WrongCredentialException(message: e.response!.data['message']);
      }

      throw Exception(e.message);
    }
  }
}