import 'package:strongtify_mobile_app/models/user/user_detail.dart';

enum ProfileStatus {
  loading,
  loaded,
  editing,
  edited,
  error,
}

class ProfileState {
  final UserDetail? user;
  final ProfileStatus status;
  final String? errorMessage;

  ProfileState({
    this.user,
    this.status = ProfileStatus.loading,
    this.errorMessage,
  });

  ProfileState copyWith({
    UserDetail? Function()? user,
    ProfileStatus? status,
    String? Function()? errorMessage,
  }) {
    return ProfileState(
      user: user != null ? user() : this.user,
      status: status ?? this.status,
      errorMessage: errorMessage != null ? errorMessage() : this.errorMessage,
    );
  }
}
