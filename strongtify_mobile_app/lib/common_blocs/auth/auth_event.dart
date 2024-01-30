abstract class AuthEvent {}

class AuthEventInitialize extends AuthEvent {
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
