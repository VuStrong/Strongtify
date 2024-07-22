import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:just_audio/just_audio.dart' as just_audio;
import 'package:strongtify_mobile_app/common_blocs/player/bloc.dart';
import 'package:strongtify_mobile_app/services/api/song_service.dart';

@singleton
class PlayerBloc extends Bloc<PlayerEvent, PlayerState> {
  final just_audio.AudioPlayer player = just_audio.AudioPlayer();

  final SongService _songService;

  PlayerBloc(this._songService) : super(PlayerState()) {
    player.playerStateStream.listen((state) {
      final processingState = state.processingState;

      if (processingState == just_audio.ProcessingState.completed) {
        add(SkipToNextEvent());

        return;
      }

      if (processingState == just_audio.ProcessingState.loading ||
          processingState == just_audio.ProcessingState.buffering ||
          !state.playing) {
        add(PausePlayerEvent(onlyUpdateState: true));
      } else {
        add(PlayPlayerEvent(onlyUpdateState: true));
      }
    });

    on<CreatePlayerEvent>(_onCreatePlayer);

    on<SkipToPreviousEvent>(_onSkipToPrevious);

    on<SkipToNextEvent>(_onSkipToNext);

    on<PlayPlayerEvent>(_onPlay);

    on<PausePlayerEvent>(_onPause);

    on<SeekToEvent>(_onSeekTo);

    on<MoveSongInQueueEvent>(_onMoveSong);
    on<AddSongToQueueEvent>(_onAddSong);
    on<RemoveSongFromQueueEvent>(_onRemoveSong);
  }

  Future<void> _onCreatePlayer(
    CreatePlayerEvent event,
    Emitter<PlayerState> emit,
  ) async {
    if (event.songs.isEmpty) return;

    final songToPlay = event.songs[event.index];

    emit(PlayerState(
      songs: [...event.songs],
      playingSong: songToPlay,
      status: PlayerStatus.paused,
      playlistId: event.playlistId,
    ));

    await player.setUrl(songToPlay.songUrl ?? '');
    player.play();

    _songService.increaseListenCount(songToPlay.id);
  }

  Future<void> _onSkipToPrevious(
    SkipToPreviousEvent event,
    Emitter<PlayerState> emit,
  ) async {
    if (state.songs == null ||
        state.songs!.isEmpty ||
        state.playingSong == null) return;

    final currentIndex = state.songs!.indexWhere(
      (song) => song.id == state.playingSong!.id,
    );

    final length = state.songs!.length;
    final prevIndex = currentIndex <= 0 ? length - 1 : currentIndex - 1;
    final songToPlay = state.songs![prevIndex];

    emit(state.copyWith(
      playingSong: () => songToPlay,
    ));

    await player.setUrl(songToPlay.songUrl ?? '');
    player.play();

    _songService.increaseListenCount(songToPlay.id);
  }

  Future<void> _onSkipToNext(
    SkipToNextEvent event,
    Emitter<PlayerState> emit,
  ) async {
    if (state.songs == null ||
        state.songs!.isEmpty ||
        state.playingSong == null) return;

    final currentIndex = state.songs!.indexWhere(
      (song) => song.id == state.playingSong!.id,
    );

    final length = state.songs!.length;
    final nextIndex = currentIndex >= length - 1 ? 0 : currentIndex + 1;
    final songToPlay = state.songs![nextIndex];

    emit(state.copyWith(
      playingSong: () => songToPlay,
    ));

    await player.setUrl(songToPlay.songUrl ?? '');
    player.play();

    _songService.increaseListenCount(songToPlay.id);
  }

  Future<void> _onPlay(
    PlayPlayerEvent event,
    Emitter<PlayerState> emit,
  ) async {
    if (!event.onlyUpdateState) player.play();

    emit(state.copyWith(
      status: PlayerStatus.playing,
    ));
  }

  Future<void> _onPause(
    PausePlayerEvent event,
    Emitter<PlayerState> emit,
  ) async {
    if (!event.onlyUpdateState) player.pause();

    emit(state.copyWith(
      status: PlayerStatus.paused,
    ));
  }

  Future<void> _onSeekTo(
    SeekToEvent event,
    Emitter<PlayerState> emit,
  ) async {
    player.seek(event.duration);
  }

  Future<void> _onMoveSong(
    MoveSongInQueueEvent event,
    Emitter<PlayerState> emit,
  ) async {
    if (state.songs == null || state.songs!.isEmpty) return;

    int length = state.songs!.length;

    if (event.from < 0 ||
        event.from >= length ||
        event.to < 0 ||
        event.to >= length ||
        event.from == event.to) return;

    final song = state.songs!.removeAt(event.from);
    state.songs!.insert(event.to, song);

    emit(state.copyWith());
  }

  Future<void> _onAddSong(
    AddSongToQueueEvent event,
    Emitter<PlayerState> emit,
  ) async {
    state.songs?.add(event.song);

    emit(state.copyWith());
  }

  Future<void> _onRemoveSong(
    RemoveSongFromQueueEvent event,
    Emitter<PlayerState> emit,
  ) async {
    if (state.songs == null || state.songs!.isEmpty) return;

    final idx = state.songs!.indexWhere((song) => song.id == event.songId);
    state.songs!.removeAt(idx);

    emit(state.copyWith());
  }
}
