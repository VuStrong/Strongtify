
import 'package:strongtify_mobile_app/utils/enums.dart';

import '../../models/account/account.dart';

class AuthState {
  const AuthState({
    this.user,
    required this.status,
  });

  final Account? user;
  final Status status;

  static AuthState init() {
    return const AuthState(status: Status.success, user: null);
  }

  AuthState copyWith({
    Account? user,
    Status? status,
  }) {
    return AuthState(
      user: user ?? this.user,
      status: status ?? this.status,
    );
  }
}
