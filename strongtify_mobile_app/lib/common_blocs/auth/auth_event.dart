import 'package:strongtify_mobile_app/models/account/account.dart';

abstract class AuthEvent {}

class AuthEventInitialize extends AuthEvent {
}

class UpdateUserEvent extends AuthEvent {
  final Account account;

  UpdateUserEvent({required this.account});
}

class AuthEventLogin extends AuthEvent {
  AuthEventLogin({
    required this.email,
    required this.password,
  });

  final String email;
  final String password;
}

class AuthEventRegister extends AuthEvent {
  AuthEventRegister({
    required this.name,
    required this.email,
    required this.password,
  });

  final String name;
  final String email;
  final String password;
}

class AuthEventLogout extends AuthEvent {
}

class AuthEventSendEmailConfirmation extends AuthEvent {
}

class AuthEventSendPasswordResetLink extends AuthEvent {
  AuthEventSendPasswordResetLink({
    required this.email,
  });

  final String email;
}

class AuthEventSaveTokens extends AuthEvent {
  final String accessToken;
  final String refreshToken;
  final Account account;

  AuthEventSaveTokens({
    required this.accessToken,
    required this.refreshToken,
    required this.account,
  });
}
