import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/common_blocs/playlists/bloc.dart';
import 'package:strongtify_mobile_app/services/api/playlist_service.dart';
import 'package:strongtify_mobile_app/services/local_storage/local_storage.dart';

@injectable
class PlaylistsBloc extends Bloc<PlaylistsEvent, PlaylistsState> {
  PlaylistsBloc(
    this._playlistService,
    this._storage,
  ) : super(PlaylistsState()) {
    on<GetCurrentUserPlaylistsEvent>(_onGetCurrentUserPlaylists);
    on<GetMorePlaylistsEvent>(_onGetMorePlaylists);
  }

  final PlaylistService _playlistService;
  final LocalStorage _storage;

  Future<void> _onGetCurrentUserPlaylists(
    GetCurrentUserPlaylistsEvent event,
    Emitter<PlaylistsState> emit,
  ) async {
    emit(LoadPlaylistsState(status: LoadPlaylistsStatus.loading));

    String userId = await _storage.getString('user_id') ?? '';

    try {
      final result = await _playlistService.getPlaylists(
        userId: userId,
        sort: 'createdAt_desc',
        take: event.take,
      );

      emit(LoadPlaylistsState(
        status: LoadPlaylistsStatus.loaded,
        playlists: result!.items,
        sort: 'createdAt_desc',
        userId: userId,
        take: event.take,
        end: result.end,
      ));
    } on Exception {
      emit(LoadPlaylistsState(
        status: LoadPlaylistsStatus.loaded,
      ));
    }
  }

  Future<void> _onGetMorePlaylists(
    GetMorePlaylistsEvent event,
    Emitter<PlaylistsState> emit,
  ) async {
    final currentState = state as LoadPlaylistsState;
    int skipTo = currentState.skip + currentState.take;

    emit(LoadPlaylistsState(
      status: LoadPlaylistsStatus.loadingMore,
      playlists: currentState.playlists,
    ));

    try {
      final result = await _playlistService.getPlaylists(
        skip: skipTo,
        take: currentState.take,
        userId: currentState.userId,
        sort: currentState.sort,
      );

      currentState.playlists!.addAll(result!.items);

      emit(LoadPlaylistsState(
        status: LoadPlaylistsStatus.loaded,
        playlists: currentState.playlists,
        skip: skipTo,
        take: currentState.take,
        userId: currentState.userId,
        end: result.end,
        sort: currentState.sort,
      ));
    } on Exception {
      emit(LoadPlaylistsState(status: LoadPlaylistsStatus.loaded));
    }
  }
}
