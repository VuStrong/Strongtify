import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/common_blocs/get_users/bloc.dart';
import 'package:strongtify_mobile_app/services/api/user_service.dart';

@injectable
class GetUsersBloc extends Bloc<GetUsersEvent, GetUsersState> {
  GetUsersBloc(
    this._userService,
  ) : super(GetUsersState()) {
    on<GetFollowingUsersEvent>(_onGetFollowingUsers);

    on<GetFollowersEvent>(_onGetFollowers);

    on<GetMoreUsersEvent>(_onGetMoreUsers);
  }

  final UserService _userService;

  Future<void> _onGetFollowingUsers(
    GetFollowingUsersEvent event,
    Emitter<GetUsersState> emit,
  ) async {
    emit(GetUsersState(status: LoadUsersStatus.loading));

    try {
      final result = await _userService.getFollowingUsers(
        event.userId,
        take: 10,
      );

      emit(GetUsersState(
        status: LoadUsersStatus.loaded,
        users: result.items,
        end: result.end,
        take: 10,
        loadBySkip: (int skip) async {
          return await _userService.getFollowingUsers(
            event.userId,
            take: 10,
            skip: skip,
          );
        },
      ));
    } on Exception {
      emit(GetUsersState(
        status: LoadUsersStatus.loaded,
      ));
    }
  }

  Future<void> _onGetFollowers(
    GetFollowersEvent event,
    Emitter<GetUsersState> emit,
  ) async {
    emit(GetUsersState(status: LoadUsersStatus.loading));

    try {
      final result = await _userService.getFollowers(
        event.userId,
        take: 10,
      );

      emit(GetUsersState(
        status: LoadUsersStatus.loaded,
        users: result.items,
        end: result.end,
        take: 10,
        loadBySkip: (int skip) async {
          return await _userService.getFollowers(
            event.userId,
            take: 10,
            skip: skip,
          );
        },
      ));
    } on Exception {
      emit(GetUsersState(
        status: LoadUsersStatus.loaded,
      ));
    }
  }

  Future<void> _onGetMoreUsers(
    GetMoreUsersEvent event,
    Emitter<GetUsersState> emit,
  ) async {
    if (state.loadBySkip == null) return;

    int skipTo = state.skip + state.take;

    emit(state.copyWith(
      status: LoadUsersStatus.loadingMore,
    ));

    try {
      final result = await state.loadBySkip!(skipTo);

      state.users!.addAll(result.items);

      emit(state.copyWith(
        status: LoadUsersStatus.loaded,
        skip: skipTo,
        end: result.end,
      ));
    } on Exception {
      emit(state.copyWith(status: LoadUsersStatus.loaded));
    }
  }
}
