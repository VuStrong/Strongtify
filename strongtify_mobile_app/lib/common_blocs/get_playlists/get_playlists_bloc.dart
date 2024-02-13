import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/common_blocs/get_playlists/bloc.dart';
import 'package:strongtify_mobile_app/services/api/me_service.dart';
import 'package:strongtify_mobile_app/services/api/playlist_service.dart';
import 'package:strongtify_mobile_app/services/local_storage/local_storage.dart';

@injectable
class GetPlaylistsBloc extends Bloc<GetPlaylistsEvent, GetPlaylistsState> {
  GetPlaylistsBloc(
    this._playlistService,
    this._meService,
    this._storage,
  ) : super(GetPlaylistsState()) {
    on<GetPlaylistsByParamsEvent>(_onGetPlaylistsByParams);

    on<GetCurrentUserPlaylistsEvent>(_onGetCurrentUserPlaylists);

    on<GetCurrentUserLikedPlaylistsEvent>(_onGetCurrentUserLikedPlaylists);

    on<GetMorePlaylistsEvent>(_onGetMorePlaylists);
  }

  final PlaylistService _playlistService;
  final MeService _meService;
  final LocalStorage _storage;

  Future<void> _onGetCurrentUserPlaylists(
    GetCurrentUserPlaylistsEvent event,
    Emitter<GetPlaylistsState> emit,
  ) async {
    emit(GetPlaylistsState(status: LoadPlaylistsStatus.loading));

    String userId = await _storage.getString('user_id') ?? '';

    try {
      final result = await _playlistService.getPlaylists(
        userId: userId,
        sort: 'createdAt_desc',
        take: event.take,
      );

      emit(GetPlaylistsState(
        status: LoadPlaylistsStatus.loaded,
        playlists: result.items,
        end: result.end,
        take: event.take,
        loadBySkip: (int skip) async {
          return await _playlistService.getPlaylists(
            userId: userId,
            sort: 'createdAt_desc',
            take: event.take,
            skip: skip,
          );
        },
      ));
    } on Exception {
      emit(GetPlaylistsState(
        status: LoadPlaylistsStatus.loaded,
      ));
    }
  }

  Future<void> _onGetPlaylistsByParams(
    GetPlaylistsByParamsEvent event,
    Emitter<GetPlaylistsState> emit,
  ) async {
    emit(GetPlaylistsState(status: LoadPlaylistsStatus.loading));

    try {
      final result = await _playlistService.getPlaylists(
        userId: event.userId,
        sort: event.sort,
        take: 10,
      );

      emit(GetPlaylistsState(
        status: LoadPlaylistsStatus.loaded,
        playlists: result.items,
        end: result.end,
        take: 10,
        loadBySkip: (int skip) async {
          return await _playlistService.getPlaylists(
            userId: event.userId,
            sort: event.sort,
            take: 10,
            skip: skip,
          );
        },
      ));
    } on Exception {
      emit(GetPlaylistsState(
        status: LoadPlaylistsStatus.loaded,
      ));
    }
  }

  Future<void> _onGetCurrentUserLikedPlaylists(
    GetCurrentUserLikedPlaylistsEvent event,
    Emitter<GetPlaylistsState> emit,
  ) async {
    emit(GetPlaylistsState(status: LoadPlaylistsStatus.loading));

    try {
      final result = await _meService.getLikedPlaylists(take: 10);

      emit(GetPlaylistsState(
        status: LoadPlaylistsStatus.loaded,
        playlists: result.items,
        end: result.end,
        take: 10,
        loadBySkip: (int skip) async {
          return await _meService.getLikedPlaylists(take: 10, skip: skip);
        },
      ));
    } on Exception {
      emit(GetPlaylistsState(
        status: LoadPlaylistsStatus.loaded,
      ));
    }
  }

  Future<void> _onGetMorePlaylists(
    GetMorePlaylistsEvent event,
    Emitter<GetPlaylistsState> emit,
  ) async {
    if (state.loadBySkip == null) return;

    int skipTo = state.skip + state.take;

    emit(state.copyWith(
      status: LoadPlaylistsStatus.loadingMore,
    ));

    try {
      final result = await state.loadBySkip!(skipTo);

      state.playlists!.addAll(result.items);

      emit(state.copyWith(
        status: LoadPlaylistsStatus.loaded,
        skip: skipTo,
        end: result.end,
      ));
    } on Exception {
      emit(state.copyWith(status: LoadPlaylistsStatus.loaded));
    }
  }
}
