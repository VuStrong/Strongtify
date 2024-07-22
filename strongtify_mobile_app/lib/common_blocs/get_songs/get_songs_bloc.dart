import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/common_blocs/get_songs/bloc.dart';
import 'package:strongtify_mobile_app/services/api/me_service.dart';
import 'package:strongtify_mobile_app/services/api/song_service.dart';

@injectable
class GetSongsBloc extends Bloc<GetSongsEvent, GetSongsState> {
  final int _songsPerLoad = 10;

  GetSongsBloc(
    this._songService,
    this._meService,
  ) : super(GetSongsState()) {
    on<GetSongsByParamsEvent>(_onGetSongsByParams);
    on<GetCurrentUserLikedSongsEvent>(_onGetCurrentUserLikedSongs);
    on<GetCurrentUserListenHistoryEvent>(_onGetCurrentUserListenHistory);
    on<GetMoreSongsEvent>(_onGetMoreSongs);
    on<RemoveSongFromListenHistoryEvent>(_onRemoveSongFromListenHistory);
  }

  final SongService _songService;
  final MeService _meService;

  Future<void> _onGetSongsByParams(
    GetSongsByParamsEvent event,
    Emitter<GetSongsState> emit,
  ) async {
    emit(GetSongsState(status: LoadSongsStatus.loading));

    try {
      final result = await _songService.getSongs(
        skip: 0,
        take: _songsPerLoad,
        genreId: event.genreId,
        artistId: event.artistId,
        sort: event.sort,
      );

      emit(GetSongsState(
        status: LoadSongsStatus.loaded,
        songs: result.items,
        end: result.end,
        loadBySkip: (int skip) async {
          return await _songService.getSongs(
            skip: skip,
            take: _songsPerLoad,
            genreId: event.genreId,
            artistId: event.artistId,
            sort: event.sort,
          );
        },
      ));
    } on Exception {
      emit(GetSongsState(status: LoadSongsStatus.loaded));
    }
  }

  Future<void> _onGetCurrentUserLikedSongs(
    GetCurrentUserLikedSongsEvent event,
    Emitter<GetSongsState> emit,
  ) async {
    emit(GetSongsState(status: LoadSongsStatus.loading));

    try {
      final result = await _meService.getLikedSongs(take: _songsPerLoad);

      emit(GetSongsState(
        status: LoadSongsStatus.loaded,
        songs: result.items,
        end: result.end,
        loadBySkip: (int skip) async {
          return await _meService.getLikedSongs(
            skip: skip,
            take: _songsPerLoad,
          );
        },
      ));
    } on Exception {
      emit(GetSongsState(status: LoadSongsStatus.loaded));
    }
  }

  Future<void> _onGetCurrentUserListenHistory(
    GetCurrentUserListenHistoryEvent event,
    Emitter<GetSongsState> emit,
  ) async {
    emit(GetSongsState(status: LoadSongsStatus.loading));

    try {
      final result = await _meService.getListenHistory(take: _songsPerLoad);

      emit(GetSongsState(
        status: LoadSongsStatus.loaded,
        songs: result.items,
        end: result.end,
        loadBySkip: (int skip) async {
          return await _meService.getListenHistory(
            skip: skip,
            take: _songsPerLoad,
          );
        },
      ));
    } on Exception {
      emit(GetSongsState(status: LoadSongsStatus.loaded));
    }
  }

  Future<void> _onRemoveSongFromListenHistory(
    RemoveSongFromListenHistoryEvent event,
    Emitter<GetSongsState> emit,
  ) async {
    if (state.songs == null) {
      return;
    }

    final idx = state.songs!.indexWhere((song) => song.id == event.songId);
    state.songs!.removeAt(idx);
    emit(state.copyWith());

    try {
      await _meService.removeListenHistory(event.songId);
    } on Exception {
      //
    }
  }

  Future<void> _onGetMoreSongs(
    GetMoreSongsEvent event,
    Emitter<GetSongsState> emit,
  ) async {
    if (state.loadBySkip == null) return;

    int skipTo = state.skip + _songsPerLoad;

    emit(state.copyWith(
      status: LoadSongsStatus.loadingMore,
    ));

    try {
      final result = await state.loadBySkip!(skipTo);

      state.songs!.addAll(result.items);

      emit(state.copyWith(
        status: LoadSongsStatus.loaded,
        skip: skipTo,
        end: result.end,
      ));
    } on Exception {
      emit(state.copyWith(status: LoadSongsStatus.loaded));
    }
  }
}
