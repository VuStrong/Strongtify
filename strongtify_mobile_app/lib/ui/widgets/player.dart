import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:just_audio/just_audio.dart' as just_audio;
import 'package:just_audio_background/just_audio_background.dart';
import 'package:strongtify_mobile_app/common_blocs/player/bloc.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class Player extends StatefulWidget {
  const Player({super.key});

  @override
  State<Player> createState() => _PlayerState();
}

class _PlayerState extends State<Player> {
  final _player = just_audio.AudioPlayer();
  double _currentSliderValue = 0;

  @override
  void initState() {
    _player.playerStateStream.listen((state) {
      final processingState = state.processingState;
      final playing = state.playing;

      if (processingState == just_audio.ProcessingState.loading ||
          processingState == just_audio.ProcessingState.buffering ||
          !playing ||
          processingState == just_audio.ProcessingState.completed) {
        context.read<PlayerBloc>().add(PausePlayerEvent());
      } else {
        context.read<PlayerBloc>().add(PlayPlayerEvent());
      }
    });

    _player.currentIndexStream.listen((index) {
      if (index != null) {
        context.read<PlayerBloc>().add(SkipToEvent(index: index));
      }
    });

    _player.positionStream.listen((duration) {
      if (_player.duration == null) return;

      setState(() {
        _currentSliderValue =
            (duration.inSeconds / _player.duration!.inSeconds) * 100;
      });
    });

    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<PlayerBloc, PlayerState>(
      listener: (context, PlayerState state) async {
        if (state.status == PlayerStatus.ready && state.songs != null) {
          final playlist = just_audio.ConcatenatingAudioSource(
            useLazyPreparation: true,
            children: state.songs!
                .map(
                  (song) => just_audio.AudioSource.uri(
                    Uri.parse(song.songUrl ?? ''),
                    tag: MediaItem(
                      id: song.id,
                      title: song.name,
                      artist: song.artists?.map((a) => a.name).join(', '),
                      artUri: Uri.parse(song.imageUrl ?? ''),
                    ),
                  ),
                )
                .toList(),
          );

          await _player.setAudioSource(
            playlist,
            initialIndex: state.currentIndex,
            initialPosition: Duration.zero,
          );
          await _player.setLoopMode(just_audio.LoopMode.all);
          _player.play();
        }
      },
      builder: (context, PlayerState state) {
        if (state.songs == null || state.songs!.isEmpty) {
          return const SizedBox();
        }

        return _buildPlayer(context, state);
      },
    );
  }

  Widget _buildPlayer(BuildContext context, PlayerState state) {
    return Column(
      children: [
        Container(
          height: 10,
          decoration: BoxDecoration(
            color: Colors.grey[850],
          ),
          alignment: Alignment.topCenter,
          child: SizedBox(
            height: 3,
            child: Material(
              color: Colors.transparent,
              child: SliderTheme(
                data: SliderThemeData(
                  trackHeight: 3,
                  thumbColor: Colors.transparent,
                  thumbShape:
                      const RoundSliderThumbShape(enabledThumbRadius: 0.0),
                  overlayShape: SliderComponentShape.noOverlay,
                ),
                child: Slider(
                  value: _currentSliderValue,
                  max: 100,
                  min: 0,
                  activeColor: ColorConstants.primary,
                  inactiveColor: Colors.grey,
                  allowedInteraction: SliderInteraction.tapOnly,
                  onChanged: (double value) {
                    if (_player.duration == null) return;

                    final seconds = value / 100 * _player.duration!.inSeconds;
                    _player.seek(Duration(seconds: seconds.toInt()));
                  },
                ),
              ),
            ),
          ),
        ),
        Container(
          decoration: BoxDecoration(
            color: Colors.grey[850],
          ),
          height: 60,
          padding: const EdgeInsets.only(right: 5, left: 5),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildSong(state.playingSong),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    onPressed: () {
                      _player.seekToPrevious();
                    },
                    icon: const Icon(Icons.skip_previous),
                    color: Colors.white,
                  ),
                  IconButton(
                    onPressed: () {
                      if (_player.playing) {
                        _player.pause();
                      } else {
                        _player.play();
                      }
                    },
                    icon: state.status == PlayerStatus.playing
                        ? const Icon(Icons.pause)
                        : const Icon(Icons.play_arrow),
                    color: Colors.white,
                  ),
                  IconButton(
                    onPressed: () {
                      _player.seekToNext();
                    },
                    icon: const Icon(Icons.skip_next),
                    color: Colors.white,
                  ),
                ],
              )
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSong(Song? song) {
    return Container(
      padding: const EdgeInsetsDirectional.only(start: 0, end: 0),
      decoration: const BoxDecoration(
        color: Colors.transparent,
      ),
      width: 220,
      child: Row(
        mainAxisSize: MainAxisSize.max,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          SizedBox(
            width: 45,
            height: 45,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: song?.imageUrl != null
                  ? Image.network(
                      song!.imageUrl!,
                      fit: BoxFit.cover,
                    )
                  : Image.asset('assets/img/default-song-img.png'),
            ),
          ),
          const SizedBox(width: 12),
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                width: 160,
                child: Text(
                  song?.name ?? 'NULL',
                  style: const TextStyle(
                    color: Colors.white,
                    overflow: TextOverflow.ellipsis,
                    fontSize: 14,
                    decoration: TextDecoration.none,
                  ),
                ),
              ),
              const SizedBox(height: 5),
              SizedBox(
                width: 160,
                child: Text(
                  song?.artists?.map((artist) => artist.name).join(', ') ?? '',
                  style: const TextStyle(
                    color: Colors.white54,
                    overflow: TextOverflow.ellipsis,
                    fontSize: 12,
                    decoration: TextDecoration.none,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
