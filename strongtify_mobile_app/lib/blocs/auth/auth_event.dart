import 'package:equatable/equatable.dart';

abstract class AuthEvent extends Equatable {}

class AuthInitialize extends AuthEvent {
  @override
  List<Object?> get props => <Object?>[];
}

class AuthLogin extends AuthEvent {
  AuthLogin({
    required this.email,
    required this.password,
  });

  final String email;
  final String password;

  @override
  List<Object?> get props => <Object?>[email, password];
}

class AuthRegister extends AuthEvent {
  AuthRegister({
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

class AuthLogout extends AuthEvent {
  @override
  List<Object?> get props => <Object?>[];
}
