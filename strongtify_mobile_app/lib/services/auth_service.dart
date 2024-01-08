import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/dio/dio_client.dart';
import 'package:strongtify_mobile_app/services/api_service.dart';

@injectable
class AuthService extends ApiService {
  AuthService(DioClient dioClient) : super(dioClient);

  Future<void> login(String email, String password) async {

  }
}