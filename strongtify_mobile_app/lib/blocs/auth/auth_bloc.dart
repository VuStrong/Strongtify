import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/exceptions/auth_exception.dart';
import 'package:strongtify_mobile_app/services/auth_service.dart';

import 'bloc.dart';

@injectable
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc(this._authService) : super(AuthState.init()) {
    on<AuthEventInitialize>(onInitialize);
    on<AuthEventLogin>(onLogin);

    add(AuthEventInitialize());
  }

  final AuthService _authService;

  Future<void> onInitialize(
      AuthEventInitialize event, Emitter<AuthState> emit) async {
    emit(state.copyWith(isInitializing: true));

    await Future.delayed(const Duration(seconds: 3));

    emit(state.copyWith(isInitializing: false));
  }

  Future<void> onLogin(AuthEventLogin event, Emitter<AuthState> emit) async {
    emit(state.copyWith(isLoading: true));

    try {
      var user = await _authService.login(event.email, event.password);

      emit(state.copyWith(isLoading: false, user: user));
    } on WrongCredentialException catch (e) {
      emit(state.copyWith(
          isLoading: false, user: null, errorMessage: e.message));
    } catch (e) {
      emit(state.copyWith(
          isLoading: false, user: null, errorMessage: 'Something went wrong!'));
    }
  }
}
