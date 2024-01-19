import '../../models/account/account.dart';

class AuthState {
  const AuthState({
    this.user,
    this.isLoading = false,
    this.isInitializing = false,
    this.errorMessage,
    this.resetPasswordErrorMessage,
    this.sendCodeSuccessful = false,
  });

  final Account? user;
  final bool isLoading;
  final bool isInitializing;
  final String? errorMessage;
  final String? resetPasswordErrorMessage;
  final bool sendCodeSuccessful;

  static AuthState init() {
    return const AuthState();
  }

  AuthState copyWith({
    Account? Function()? user,
    bool? isLoading,
    bool? isInitializing,
    String? Function()? errorMessage,
    String? Function()? resetPasswordErrorMessage,
    bool? sendCodeSuccessful,
  }) {
    return AuthState(
      user: user != null ? user() : this.user,
      isLoading: isLoading ?? this.isLoading,
      isInitializing: isInitializing ?? this.isInitializing,
      errorMessage: errorMessage != null ? errorMessage() : this.errorMessage,
      resetPasswordErrorMessage: resetPasswordErrorMessage != null
          ? resetPasswordErrorMessage()
          : this.resetPasswordErrorMessage,
      sendCodeSuccessful: sendCodeSuccessful ?? this.sendCodeSuccessful,
    );
  }
}
