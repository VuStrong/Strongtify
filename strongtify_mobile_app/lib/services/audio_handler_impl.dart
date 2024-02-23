import 'package:audio_service/audio_service.dart';
import 'package:just_audio/just_audio.dart';
import 'package:strongtify_mobile_app/common_blocs/player/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';

class AudioHandlerImpl extends BaseAudioHandler with QueueHandler, SeekHandler {
  late final PlayerBloc _playerBloc;

  AudioHandlerImpl() {
    _playerBloc = getIt<PlayerBloc>();

    _playerBloc.player.playbackEventStream.listen(_broadcastState);

    // listen to playing song of playerBloc to update mediaItem
    _playerBloc.stream.listen((state) {
      if (state.playingSong == null) return;

      final song = state.playingSong!;

      if (song.id != mediaItem.value?.id) {
        mediaItem.add(songToMediaItem(song));
      }
    });
  }

  @override
  Future<void> play() async {
    _playerBloc.add(PlayPlayerEvent());
  }

  @override
  Future<void> pause() async {
    _playerBloc.add(PausePlayerEvent());
  }

  @override
  Future<void> seek(Duration position) async {
    _playerBloc.add(SeekToEvent(duration: position));
  }

  @override
  Future<void> skipToPrevious() async {
    _playerBloc.add(SkipToPreviousEvent());
  }

  @override
  Future<void> skipToNext() async {
    _playerBloc.add(SkipToNextEvent());
  }

  MediaItem songToMediaItem(Song song) {
    return MediaItem(
      id: song.id,
      title: song.name,
      artist: song.artists?.map((a) => a.name).join(', '),
      artUri: song.imageUrl != null ? Uri.parse(song.imageUrl!) : null,
      duration: Duration(seconds: song.length),
    );
  }

  void _broadcastState(PlaybackEvent event) {
    final playing = _playerBloc.player.playing;

    playbackState.add(playbackState.value.copyWith(
      controls: [
        MediaControl.skipToPrevious,
        if (playing) MediaControl.pause else MediaControl.play,
        MediaControl.skipToNext,
      ],
      systemActions: const {
        MediaAction.seek,
        MediaAction.seekForward,
        MediaAction.seekBackward,
      },
      androidCompactActionIndices: const [0, 1, 2],
      processingState: const {
        ProcessingState.idle: AudioProcessingState.idle,
        ProcessingState.loading: AudioProcessingState.loading,
        ProcessingState.buffering: AudioProcessingState.buffering,
        ProcessingState.ready: AudioProcessingState.ready,
        ProcessingState.completed: AudioProcessingState.completed,
      }[_playerBloc.player.processingState]!,
      playing: playing,
      updatePosition: _playerBloc.player.position,
      bufferedPosition: _playerBloc.player.bufferedPosition,
    ));
  }
}
