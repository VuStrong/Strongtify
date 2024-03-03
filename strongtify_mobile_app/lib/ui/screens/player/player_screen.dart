import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:persistent_bottom_nav_bar_v2/persistent-tab-view.dart';
import 'package:strongtify_mobile_app/common_blocs/player/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/user_favs/bloc.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/ui/screens/artist_detail/artist_detail_screen.dart';
import 'package:strongtify_mobile_app/ui/widgets/artist/small_artist_item.dart';
import 'package:strongtify_mobile_app/ui/widgets/bottom_navigation_app.dart';
import 'package:strongtify_mobile_app/ui/widgets/marquee.dart';
import 'package:strongtify_mobile_app/utils/bottom_sheet/song_menu_bottom_sheet.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';
import 'package:strongtify_mobile_app/utils/extensions.dart';

class PlayerScreen extends StatefulWidget {
  const PlayerScreen({super.key});

  @override
  State<PlayerScreen> createState() => _PlayerScreenState();
}

class _PlayerScreenState extends State<PlayerScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        title: BlocBuilder<PlayerBloc, PlayerState>(
          builder: (context, PlayerState state) {
            return Text(state.playingSong?.name ?? '');
          },
        ),
        leading: IconButton(
          onPressed: () {
            Navigator.pop(context);
          },
          icon: const Icon(Icons.keyboard_arrow_down),
        ),
        actions: [
          BlocBuilder<PlayerBloc, PlayerState>(
            builder: (context, PlayerState state) {
              if (state.playingSong == null) return const SizedBox();

              return IconButton(
                onPressed: () {
                  showSongMenuBottomSheet(context, song: state.playingSong!,
                      onTapArtist: () {
                    Navigator.pop(context);
                  });
                },
                icon: const Icon(Icons.more_vert_outlined),
              );
            },
          ),
        ],
      ),
      body: _buildPlayer(),
    );
  }

  Widget _buildPlayer() {
    return BlocBuilder<PlayerBloc, PlayerState>(
      builder: (context, PlayerState state) {
        final song = state.playingSong;

        if (song == null) return const SizedBox();

        return SingleChildScrollView(
          child: Column(
            children: [
              const SizedBox(height: 30),
              Center(
                child: Container(
                  width: MediaQuery.of(context).size.width * 0.7,
                  height: MediaQuery.of(context).size.width * 0.7,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.5),
                        spreadRadius: 5,
                        blurRadius: 20,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: song.imageUrl != null
                      ? Image.network(
                          song.imageUrl!,
                          fit: BoxFit.cover,
                        )
                      : Image.asset('assets/img/default-song-img.png'),
                ),
              ),
              const SizedBox(height: 20),
              Marquee(
                text: song.name,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                ),
              ),
              const SizedBox(height: 5),
              Text(
                song.artists?.map((a) => a.name).join(', ') ?? '',
                style: const TextStyle(
                  color: Colors.white54,
                ),
              ),
              const SizedBox(height: 5),
              Text(
                '${song.listenCount} lượt nghe - ${song.likeCount} lượt thích',
                style: const TextStyle(
                  color: Colors.white70,
                  fontSize: 12,
                ),
              ),
              Row(
                children: [_buildLikeButton(context, song)],
              ),
              _buildSeekBar(context),
              _buildControl(context, state),
              const SizedBox(height: 20),
              const Divider(
                height: 1,
                thickness: 1,
                color: Colors.white30,
              ),
              const SizedBox(height: 20),
              ...song.artists
                      ?.map(
                        (artist) => SmallArtistItem(
                          artist: artist,
                          onTap: () {
                            Navigator.pop(context);

                            pushNewScreen(
                              BottomNavigationApp.tabContext,
                              screen: ArtistDetailScreen(artistId: artist.id),
                            );
                          },
                        ),
                      )
                      .toList() ??
                  [],
            ],
          ),
        );
      },
    );
  }

  Widget _buildLikeButton(BuildContext context, Song song) {
    return BlocBuilder<UserFavsBloc, UserFavsState>(
      builder: (context, UserFavsState state) {
        final liked = state.data.likedSongIds.contains(song.id);

        return IconButton(
          tooltip: liked ? 'Bỏ thích' : 'Thích',
          onPressed: () {
            if (liked) {
              context.read<UserFavsBloc>().add(UnlikeSongEvent(
                    songId: song.id,
                  ));
            } else {
              context.read<UserFavsBloc>().add(LikeSongEvent(
                    songId: song.id,
                  ));
            }
          },
          iconSize: 50,
          icon: Icon(
            liked ? Icons.favorite : Icons.favorite_border,
            color: ColorConstants.primary,
          ),
        );
      },
    );
  }

  Widget _buildSeekBar(BuildContext context) {
    final playerBloc = context.read<PlayerBloc>();

    return StreamBuilder<Duration>(
      stream: playerBloc.player.positionStream,
      builder: (context, snapshot) {
        final position = snapshot.data?.inSeconds.toDouble() ?? 0;
        final duration = playerBloc.player.duration?.inSeconds.toDouble() ?? 0;

        return Column(
          children: [
            Slider(
              value: position,
              max: duration,
              min: 0,
              activeColor: ColorConstants.primary,
              inactiveColor: Colors.grey,
              allowedInteraction: SliderInteraction.tapOnly,
              onChanged: (double value) {
                context.read<PlayerBloc>().add(SeekToEvent(
                      duration: Duration(seconds: value.toInt()),
                    ));
              },
            ),
            Padding(
              padding: const EdgeInsets.only(right: 25, left: 25),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    position.toInt().toFormattedLength(),
                    style: const TextStyle(color: Colors.white70),
                  ),
                  Text(
                    duration.toInt().toFormattedLength(),
                    style: const TextStyle(color: Colors.white70),
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildControl(BuildContext context, PlayerState state) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        IconButton(
          onPressed: () {
            context.read<PlayerBloc>().add(SkipToPreviousEvent());
          },
          icon: const Icon(Icons.skip_previous),
          color: Colors.white,
          iconSize: 50,
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
              ? const Icon(Icons.pause_circle)
              : const Icon(Icons.play_circle),
          color: Colors.white,
          iconSize: 50,
        ),
        IconButton(
          onPressed: () {
            context.read<PlayerBloc>().add(SkipToNextEvent());
          },
          icon: const Icon(Icons.skip_next),
          color: Colors.white,
          iconSize: 50,
        ),
      ],
    );
  }
}
