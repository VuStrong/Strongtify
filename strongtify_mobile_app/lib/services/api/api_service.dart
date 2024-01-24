import 'package:strongtify_mobile_app/dio/dio_client.dart';

abstract class ApiService {
  ApiService(this.dioClient);

  final DioClient dioClient;
}