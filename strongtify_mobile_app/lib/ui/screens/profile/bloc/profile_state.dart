import 'package:strongtify_mobile_app/models/user/user_detail.dart';

class ProfileState {
  final UserDetail? user;
  final bool isLoading;

  ProfileState({
    this.user,
    this.isLoading = false,
  });
}