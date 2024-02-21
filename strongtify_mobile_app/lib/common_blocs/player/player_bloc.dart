import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/common_blocs/player/bloc.dart';
import 'package:strongtify_mobile_app/services/api/song_service.dart';

@singleton
class PlayerBloc extends Bloc<PlayerEvent, PlayerState> {
  PlayerBloc(this._songService) : super(PlayerState()) {
    on<CreatePlayerEvent>(_onCreatePlayer);

    on<SkipToEvent>(_onSkipTo);

    on<PlayPlayerEvent>(_onPlay);

    on<PausePlayerEvent>(_onPause);
  }

  final SongService _songService;

  Future<void> _onCreatePlayer(
    CreatePlayerEvent event,
    Emitter<PlayerState> emit,
  ) async {
    if (event.songs.isEmpty) return;

    emit(PlayerState(
      songs: event.songs,
      currentIndex: event.index,
      playingSong: event.songs[event.index],
      status: PlayerStatus.ready,
    ));
  }

  Future<void> _onSkipTo(
    SkipToEvent event,
    Emitter<PlayerState> emit,
  ) async {
    emit(state.copyWith(
      currentIndex: event.index,
      playingSong: () => state.songs?[event.index],
      status: PlayerStatus.idle,
    ));
  }

  Future<void> _onPlay(
    PlayPlayerEvent event,
    Emitter<PlayerState> emit,
  ) async {
    emit(state.copyWith(
      status: PlayerStatus.playing,
    ));
  }

  Future<void> _onPause(
    PausePlayerEvent event,
    Emitter<PlayerState> emit,
  ) async {
    emit(state.copyWith(
      status: PlayerStatus.idle,
    ));
  }
}
