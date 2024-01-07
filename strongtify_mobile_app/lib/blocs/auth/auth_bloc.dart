import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:strongtify_mobile_app/blocs/auth/auth_event.dart';
import 'package:strongtify_mobile_app/blocs/auth/auth_state.dart';

import '../../enums/status.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc() : super(AuthState.init()) {
    on<AuthInitialize>(onInitialize);

    add(AuthInitialize());
  }

  Future<void> onInitialize(
      AuthInitialize event, Emitter<AuthState> emit) async {
    emit(state.copyWith(
      status: Status.inProgress  
    ));

    await Future.delayed(Duration(seconds: 3));

    emit(state.copyWith(
        status: Status.success
    ));
    
    return;
  }
}
