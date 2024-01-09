import '../../models/account/account.dart';

class AuthState {
  const AuthState({
    this.user,
    this.isLoading = false,
    this.isInitializing = false,
    this.errorMessage
  });

  final Account? user;
  final bool isLoading;
  final bool isInitializing;
  final String? errorMessage;

  static AuthState init() {
    return const AuthState();
  }

  AuthState copyWith({
    Account? user,
    bool? isLoading,
    bool? isInitializing,
    String? errorMessage
  }) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      isInitializing: isInitializing ?? this.isInitializing,
      errorMessage: errorMessage ?? this.errorMessage
    );
  }
}
