class ChangePasswordState {
  final bool isChanging;
  final bool isSuccess;
  final String? errorMessage;

  ChangePasswordState({
    this.errorMessage,
    this.isSuccess = false,
    this.isChanging = false,
  });
}