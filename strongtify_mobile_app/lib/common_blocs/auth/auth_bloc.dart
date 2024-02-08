import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/exceptions/auth_exceptions.dart';
import 'package:strongtify_mobile_app/exceptions/user_exceptions.dart';
import 'package:strongtify_mobile_app/models/account/account.dart';
import 'package:strongtify_mobile_app/services/api/me_service.dart';
import 'package:strongtify_mobile_app/services/api/auth_service.dart';
import 'package:strongtify_mobile_app/services/local_storage/local_storage.dart';

import 'bloc.dart';

@lazySingleton
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc(this._authService, this._accountService, this._storage)
      : super(AuthState.init()) {
    on<AuthEventInitialize>(_onInitialize);
    on<AuthEventLogin>(_onLogin);
    on<AuthEventRegister>(_onRegister);
    on<AuthEventLogout>(_onLogout);
    on<AuthEventSendEmailConfirmation>(_onSendEmailConfirmation);
    on<AuthEventSendPasswordResetLink>(_onSendPasswordResetLink);

    add(AuthEventInitialize());
  }

  final AuthService _authService;
  final MeService _accountService;
  final LocalStorage _storage;

  Future<void> _onInitialize(
      AuthEventInitialize event, Emitter<AuthState> emit) async {
    emit(state.copyWith(isInitializing: true));

    String? refreshToken = await _storage.getString('refresh_token');

    if (refreshToken != null) {
      try {
        Account? account = await _accountService.getCurrentAccount();

        emit(state.copyWith(isInitializing: false, user: () => account));
      } on UserNotFoundException {
        emit(state.copyWith(isInitializing: false, user: () => null));
      }
    } else {
      emit(state.copyWith(isInitializing: false, user: () => null));
    }
  }

  Future<void> _onLogin(AuthEventLogin event, Emitter<AuthState> emit) async {
    emit(state.copyWith(isLoading: true));

    try {
      var user = await _authService.login(event.email, event.password);

      emit(state.copyWith(
          isLoading: false, user: () => user, errorMessage: () => null));
    } on WrongCredentialException catch (e) {
      emit(state.copyWith(
          isLoading: false, user: () => null, errorMessage: () => e.message));
    } on UserIsLockedOutException catch (e) {
      emit(state.copyWith(
          isLoading: false, user: () => null, errorMessage: () => e.message));
    } catch (e) {
      emit(state.copyWith(
          isLoading: false,
          user: () => null,
          errorMessage: () => 'Something went wrong!'));
    }
  }

  Future<void> _onRegister(
      AuthEventRegister event, Emitter<AuthState> emit) async {
    emit(state.copyWith(isLoading: true));

    try {
      var user = await _authService.register(
        name: event.name,
        email: event.email,
        password: event.password,
      );

      emit(state.copyWith(
        isLoading: false,
        user: () => user,
        errorMessage: () => null,
      ));
    } on EmailAlreadyExistsException catch (e) {
      emit(state.copyWith(
        isLoading: false,
        user: () => null,
        errorMessage: () => e.message,
      ));
    } catch (e) {
      emit(
        state.copyWith(
            isLoading: false,
            user: () => null,
            errorMessage: () => 'Something went wrong!'),
      );
    }
  }

  Future<void> _onLogout(AuthEventLogout event, Emitter<AuthState> emit) async {
    emit(state.copyWith(isLoading: true, sendCodeSuccessful: false));

    await _storage.deleteAll();

    emit(state.copyWith(isLoading: false, user: () => null));
  }

  Future<void> _onSendEmailConfirmation(
      AuthEventSendEmailConfirmation event, Emitter<AuthState> emit) async {
    emit(state.copyWith(isLoading: true, sendCodeSuccessful: false));

    try {
      await _authService.sendEmailConfirmation();
    } on Exception {
      //
    }

    emit(state.copyWith(isLoading: false, sendCodeSuccessful: true));
  }

  Future<void> _onSendPasswordResetLink(
      AuthEventSendPasswordResetLink event, Emitter<AuthState> emit) async {
    emit(state.copyWith(
      isLoading: true,
      sendCodeSuccessful: false,
      resetPasswordErrorMessage: () => null,
    ));

    try {
      await _authService.sendPasswordResetLink(event.email);

      emit(state.copyWith(
        isLoading: false,
        sendCodeSuccessful: true,
        resetPasswordErrorMessage: () => null,
      ));
    } on EmailNotFoundException catch (e) {
      emit(state.copyWith(
        isLoading: false,
        sendCodeSuccessful: false,
        resetPasswordErrorMessage: () => e.message,
      ));
    } catch (e) {
      emit(state.copyWith(
        isLoading: false,
        sendCodeSuccessful: false,
        resetPasswordErrorMessage: () => 'Gửi mã xác thực thất bại!',
      ));
    }
  }
}
