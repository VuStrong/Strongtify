import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/common_blocs/get_artists/bloc.dart';
import 'package:strongtify_mobile_app/services/api/user_service.dart';

@injectable
class GetArtistsBloc extends Bloc<GetArtistsEvent, GetArtistsState> {
  GetArtistsBloc(
    this._userService,
  ) : super(GetArtistsState()) {
    on<GetFollowingArtistsEvent>(_onGetFollowingArtists);

    on<GetMoreArtistsEvent>(_onGetMoreArtists);
  }

  final UserService _userService;

  Future<void> _onGetFollowingArtists(
    GetFollowingArtistsEvent event,
    Emitter<GetArtistsState> emit,
  ) async {
    emit(GetArtistsState(status: LoadArtistsStatus.loading));

    try {
      final result = await _userService.getFollowingArtists(
        event.userId,
        take: 10,
      );

      emit(GetArtistsState(
        status: LoadArtistsStatus.loaded,
        artists: result.items,
        end: result.end,
        take: 10,
        loadBySkip: (int skip) async {
          return await _userService.getFollowingArtists(
            event.userId,
            take: 10,
            skip: skip,
          );
        },
      ));
    } on Exception {
      emit(GetArtistsState(
        status: LoadArtistsStatus.loaded,
      ));
    }
  }

  Future<void> _onGetMoreArtists(
    GetMoreArtistsEvent event,
    Emitter<GetArtistsState> emit,
  ) async {
    if (state.loadBySkip == null) return;

    int skipTo = state.skip + state.take;

    emit(state.copyWith(
      status: LoadArtistsStatus.loadingMore,
    ));

    try {
      final result = await state.loadBySkip!(skipTo);

      state.artists!.addAll(result.items);

      emit(state.copyWith(
        status: LoadArtistsStatus.loaded,
        skip: skipTo,
        end: result.end,
      ));
    } on Exception {
      emit(state.copyWith(status: LoadArtistsStatus.loaded));
    }
  }
}
