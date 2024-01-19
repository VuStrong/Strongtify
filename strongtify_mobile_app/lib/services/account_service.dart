import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/dio/dio_client.dart';
import 'package:strongtify_mobile_app/exceptions/user_exceptions.dart';
import 'package:strongtify_mobile_app/models/account/account.dart';
import 'package:strongtify_mobile_app/services/api_service.dart';

@injectable
class AccountService extends ApiService {
  AccountService(DioClient dioClient) : super(dioClient);

  Future<Account?> getCurrentAccount() async {
    try {
      Response response = await dioClient.dio.get('/v1/me');

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return Account.fromMap(data);
    } on DioException catch (e) {
      throw UserNotFoundException(message: e.response?.data['message']);
    }
  }
}