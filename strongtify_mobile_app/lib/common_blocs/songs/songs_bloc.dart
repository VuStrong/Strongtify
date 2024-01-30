import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/common_blocs/songs/bloc.dart';
import 'package:strongtify_mobile_app/services/api/song_service.dart';

@injectable
class SongsBloc extends Bloc<SongsEvent, SongsState> {
  SongsBloc(this._songService) : super(SongsState()) {
    on<GetSongsEvent>(_onGetSongs);
    on<GetMoreSongsEvent>(_onGetMoreSongs);
  }

  final SongService _songService;

  Future<void> _onGetSongs(GetSongsEvent event, Emitter<SongsState> emit) async {
    emit(LoadSongsState(status: LoadSongsStatus.loading));

    try {
      final result = await _songService.getSongs(
        skip: 0,
        take: 10,
        genreId: event.genreId,
        artistId: event.artistId,
        sort: event.sort,
      );

      emit(LoadSongsState(
        status: LoadSongsStatus.loaded,
        songs: result.items,
        genreId: event.genreId,
        artistId: event.artistId,
        take: 10,
        end: result.end,
        sort: event.sort,
      ));
    } on Exception {
      emit(LoadSongsState(status: LoadSongsStatus.loaded));
    }
  }

  Future<void> _onGetMoreSongs(GetMoreSongsEvent event, Emitter<SongsState> emit) async {
    final currentState = state as LoadSongsState;
    int skipTo = currentState.skip + currentState.take;

    emit(LoadSongsState(
      status: LoadSongsStatus.loadingMore,
      songs: currentState.songs,
    ));

    try {
      final result = await _songService.getSongs(
        skip: skipTo,
        take: currentState.take,
        genreId: currentState.genreId,
        artistId: currentState.artistId,
        sort: currentState.sort,
      );

      currentState.songs!.addAll(result.items);

      emit(LoadSongsState(
        status: LoadSongsStatus.loaded,
        songs: currentState.songs,
        skip: skipTo,
        take: currentState.take,
        genreId: currentState.genreId,
        artistId: currentState.artistId,
        end: result.end,
        sort: currentState.sort,
      ));
    } on Exception {
      emit(LoadSongsState(
          status: LoadSongsStatus.loaded
      ));
    }
  }
}