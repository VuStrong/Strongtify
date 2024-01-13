import '../../models/account/account.dart';

class AuthState {
  const AuthState({
    this.user,
    this.isLoading = false,
    this.isInitializing = false,
    this.errorMessage,
    this.sendCodeSuccessful = false,
  });

  final Account? user;
  final bool isLoading;
  final bool isInitializing;
  final String? errorMessage;
  final bool sendCodeSuccessful;

  static AuthState init() {
    return const AuthState();
  }

  AuthState copyWith({
    Account? Function()? user,
    bool? isLoading,
    bool? isInitializing,
    String? Function()? errorMessage,
    bool? sendCodeSuccessful,
  }) {
    return AuthState(
      user: user != null ? user() : this.user,
      isLoading: isLoading ?? this.isLoading,
      isInitializing: isInitializing ?? this.isInitializing,
      errorMessage: errorMessage != null ? errorMessage() : this.errorMessage,
      sendCodeSuccessful: sendCodeSuccessful ?? this.sendCodeSuccessful,
    );
  }
}
