import 'package:strongtify_mobile_app/models/user_favs.dart';

class UserFavsState {
  final UserFavs data;
  final bool isLoadingFavs;

  UserFavsState({
    required this.data,
    this.isLoadingFavs = false,
  });

  UserFavsState copyWith({
    UserFavs? data,
    bool? isLoadingFavs,
  }) {
    return UserFavsState(
      data: data ?? this.data,
      isLoadingFavs: isLoadingFavs ?? this.isLoadingFavs,
    );
  }
}
