import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/common_blocs/auth/auth_bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/auth/auth_event.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/models/user/user_detail.dart';
import 'package:strongtify_mobile_app/services/api/me_service.dart';
import 'package:strongtify_mobile_app/services/api/user_service.dart';
import 'package:strongtify_mobile_app/ui/screens/profile/bloc/bloc.dart';

@injectable
class ProfileBloc extends Bloc<ProfileEvent, ProfileState> {
  ProfileBloc(
    this._userService,
    this._meService,
  ) : super(ProfileState()) {
    on<GetProfileByUserIdEvent>(_onGetProfileByUserId);
    on<EditProfileEvent>(_onEditProfile);
  }

  final UserService _userService;
  final MeService _meService;

  Future<void> _onGetProfileByUserId(
    GetProfileByUserIdEvent event,
    Emitter<ProfileState> emit,
  ) async {
    emit(ProfileState(status: ProfileStatus.loading));

    final user = await _userService.getUserById(event.id);

    emit(ProfileState(
      status: ProfileStatus.loaded,
      user: user,
    ));
  }

  Future<void> _onEditProfile(
    EditProfileEvent event,
    Emitter<ProfileState> emit,
  ) async {
    emit(state.copyWith(status: ProfileStatus.editing));

    try {
      final editedAccount = await _meService.editAccount(
        name: event.name,
        about: event.about,
        image: event.image,
      );

      UserDetail user = state.user!;
      user.name = editedAccount.name;
      user.about = editedAccount.about;
      user.imageUrl = editedAccount.imageUrl;

      emit(state.copyWith(
        status: ProfileStatus.edited,
        user: () => user,
        errorMessage: () => null,
      ));

      getIt<AuthBloc>().add(UpdateUserEvent(account: editedAccount));
    } on Exception {
      emit(state.copyWith(
        status: ProfileStatus.error,
        errorMessage: () => 'Không thể chỉnh sửa hồ sơ!',
      ));
    }
  }
}
