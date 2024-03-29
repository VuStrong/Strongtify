import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:persistent_bottom_nav_bar_v2/persistent-tab-view.dart';
import 'package:strongtify_mobile_app/common_blocs/player/bloc.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/ui/screens/player/player_screen.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class MiniPlayer extends StatefulWidget {
  const MiniPlayer({super.key});

  @override
  State<MiniPlayer> createState() => _MiniPlayerState();
}

class _MiniPlayerState extends State<MiniPlayer> {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<PlayerBloc, PlayerState>(
      builder: (context, PlayerState state) {
        if (state.songs == null || state.songs!.isEmpty) {
          return const SizedBox();
        }

        return _buildMiniPlayer(context, state);
      },
    );
  }

  Widget _buildMiniPlayer(BuildContext context, PlayerState state) {
    final playerBloc = context.read<PlayerBloc>();

    return GestureDetector(
      onTap: () {
        _onTapPlayer(context);
      },
      child: Column(
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
                  child: StreamBuilder<Duration>(
                    stream: playerBloc.player.positionStream,
                    builder: (context, snapshot) {
                      return Slider(
                        value: snapshot.data?.inSeconds.toDouble() ?? 0,
                        max: playerBloc.player.duration?.inSeconds.toDouble() ??
                            0,
                        min: 0,
                        activeColor: ColorConstants.primary,
                        inactiveColor: Colors.grey,
                        allowedInteraction: SliderInteraction.tapOnly,
                        onChanged: (double value) {
                          context.read<PlayerBloc>().add(SeekToEvent(
                                duration: Duration(seconds: value.toInt()),
                              ));
                        },
                      );
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
                Expanded(
                  child: _buildSong(state.playingSong),
                ),
                SizedBox(
                  width: 144,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      IconButton(
                        onPressed: () {
                          context.read<PlayerBloc>().add(SkipToPreviousEvent());
                        },
                        icon: const Icon(Icons.skip_previous),
                        color: Colors.white,
                      ),
                      IconButton(
                        onPressed: () {
                          if (state.status == PlayerStatus.playing) {
                            context.read<PlayerBloc>().add(PausePlayerEvent());
                          } else if (state.status == PlayerStatus.paused) {
                            context.read<PlayerBloc>().add(PlayPlayerEvent());
                          }
                        },
                        icon: state.status == PlayerStatus.playing
                            ? const Icon(Icons.pause)
                            : const Icon(Icons.play_arrow),
                        color: Colors.white,
                      ),
                      IconButton(
                        onPressed: () {
                          context.read<PlayerBloc>().add(SkipToNextEvent());
                        },
                        icon: const Icon(Icons.skip_next),
                        color: Colors.white,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSong(Song? song) {
    return Container(
      padding: const EdgeInsetsDirectional.only(start: 0, end: 0),
      decoration: const BoxDecoration(
        color: Colors.transparent,
      ),
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
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
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
                  child: Text(
                    song?.artists?.map((artist) => artist.name).join(', ') ??
                        '',
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
          ),
        ],
      ),
    );
  }

  void _onTapPlayer(BuildContext context) {
    pushNewScreen(
      context,
      screen: const PlayerScreen(),
      pageTransitionAnimation: PageTransitionAnimation.slideUp,
    );
  }
}
