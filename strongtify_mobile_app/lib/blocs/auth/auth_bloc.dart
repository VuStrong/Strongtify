import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/services/auth_service.dart';
import 'package:strongtify_mobile_app/utils/enums.dart';

import 'bloc.dart';

@injectable
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc(this._authService) : super(AuthState.init()) {
    on<AuthInitialize>(onInitialize);
    on<AuthLogin>(onLogin);

    add(AuthInitialize());
  }

  final AuthService _authService;

  Future<void> onInitialize(
      AuthInitialize event, Emitter<AuthState> emit) async {
    emit(state.copyWith(
      status: Status.inProgress  
    ));

    await Future.delayed(const Duration(seconds: 3));

    emit(state.copyWith(
        status: Status.success
    ));
    
    return;
  }

  Future<void> onLogin(AuthLogin event, Emitter<AuthState> emit) async {
    await _authService.login(event.email, event.password);
  }
}
