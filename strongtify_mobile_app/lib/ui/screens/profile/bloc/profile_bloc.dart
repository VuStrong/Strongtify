import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/services/api/user_service.dart';
import 'package:strongtify_mobile_app/ui/screens/profile/bloc/bloc.dart';

@injectable
class ProfileBloc extends Bloc<ProfileEvent, ProfileState> {
  ProfileBloc(this._userService) : super(ProfileState()) {
    on<GetProfileByUserIdEvent>(_onGetProfileByUserId);
  }

  final UserService _userService;

  Future<void> _onGetProfileByUserId(
    GetProfileByUserIdEvent event,
    Emitter<ProfileState> emit,
  ) async {
    emit(ProfileState(isLoading: true));

    final user = await _userService.getUserById(event.id);

    emit(ProfileState(isLoading: false, user: user));
  }
}
