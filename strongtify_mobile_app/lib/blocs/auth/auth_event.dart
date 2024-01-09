import 'package:equatable/equatable.dart';

abstract class AuthEvent extends Equatable {}

class AuthEventInitialize extends AuthEvent {
  @override
  List<Object?> get props => <Object?>[];
}

class AuthEventLogin extends AuthEvent {
  AuthEventLogin({
    required this.email,
    required this.password,
  });

  final String email;
  final String password;

  @override
  List<Object?> get props => <Object?>[email, password];
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

  @override
  List<Object?> get props => <Object?>[name, email, password];
}

class AuthEventLogout extends AuthEvent {
  @override
  List<Object?> get props => <Object?>[];
}
