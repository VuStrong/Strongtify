import 'package:strongtify_mobile_app/enums/status.dart';

import '../../models/user.dart';

class AuthState {
  const AuthState({
    this.user,
    required this.status,
  });

  final User? user;
  final Status status;

  static AuthState init() {
    return const AuthState(status: Status.success, user: null);
  }

  AuthState copyWith({
    User? user,
    Status? status,
  }) {
    return AuthState(
      user: user ?? this.user,
      status: status ?? this.status,
    );
  }
}
