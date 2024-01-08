import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/dio/interceptors/token_interceptor.dart';

@singleton
class DioClient {
  DioClient() {
    _dio = Dio();
    _dio.interceptors.add(TokenInterceptor());
    _dio.options.baseUrl = dotenv.env['BACKEND_URL'] ?? '';
  }

  late final Dio _dio;

  Dio get dio => _dio;
}