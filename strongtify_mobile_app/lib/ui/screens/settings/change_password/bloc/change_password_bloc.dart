import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/exceptions/auth_exceptions.dart';
import 'package:strongtify_mobile_app/services/api/me_service.dart';
import 'package:strongtify_mobile_app/ui/screens/settings/change_password/bloc/bloc.dart';

@injectable
class ChangePasswordBloc
    extends Bloc<ChangePasswordEvent, ChangePasswordState> {
  ChangePasswordBloc(this._meService) : super(ChangePasswordState()) {
    on<ChangePasswordEvent>(_onChangePassword);
  }

  final MeService _meService;

  Future<void> _onChangePassword(
    ChangePasswordEvent event,
    Emitter<ChangePasswordState> emit,
  ) async {
    emit(ChangePasswordState(isChanging: true));

    try {
      await _meService.changePassword(
        oldPassword: event.oldPassword,
        newPassword: event.newPassword,
      );

      emit(ChangePasswordState(
        isChanging: false,
        isSuccess: true,
      ));
    } on PasswordNotMatchException catch (e) {
      emit(ChangePasswordState(
        isChanging: false,
        errorMessage: e.message,
      ));
    } on Exception {
      emit(ChangePasswordState(
        isChanging: false,
        errorMessage: 'Có lỗi xảy ra, hãy thử lại.',
      ));
    }
  }
}
