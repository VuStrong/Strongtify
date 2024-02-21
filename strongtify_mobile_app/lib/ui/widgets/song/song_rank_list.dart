import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:strongtify_mobile_app/common_blocs/player/bloc.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/ui/widgets/song/song_item.dart';
import 'package:strongtify_mobile_app/utils/bottom_sheet/song_menu_bottom_sheet.dart';

class SongRankList extends StatefulWidget {
  const SongRankList({
    super.key,
    required this.songs,
  });

  final List<Song> songs;

  @override
  State<SongRankList> createState() => _SongRankListState();
}

class _SongRankListState extends State<SongRankList> {
  @override
  Widget build(BuildContext context) {
    if (widget.songs.isEmpty) {
      return const Text(
        'Không có dữ liệu',
        style: TextStyle(color: Colors.white54),
      );
    }

    return BlocBuilder<PlayerBloc, PlayerState>(
      builder: (context, PlayerState state) {
        int index = 0;

        return Column(
          children: widget.songs.map((song) {
            index += 1;

            Widget numberWidget;

            if (index == 1) {
              numberWidget = SvgPicture.asset(
                'assets/vectors/1st.svg',
                width: 30,
                height: 30,
                color: Colors.blue,
              );
            } else if (index == 2) {
              numberWidget = SvgPicture.asset(
                'assets/vectors/2st.svg',
                width: 30,
                height: 30,
                color: Colors.greenAccent,
              );
            } else if (index == 3) {
              numberWidget = SvgPicture.asset(
                'assets/vectors/3st.svg',
                width: 30,
                height: 30,
                color: Colors.redAccent,
              );
            } else {
              numberWidget = SizedBox(
                width: 30,
                height: 30,
                child: Center(
                  child: Text(
                    index.toString(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              );
            }

            int currentIndex = index - 1;

            return Row(
              children: [
                numberWidget,
                const SizedBox(width: 10),
                Expanded(
                  child: SongItem(
                    song: song,
                    isPlaying: song.id == state.playingSong?.id,
                    action: IconButton(
                      icon: const Icon(
                        Icons.more_vert_outlined,
                        color: Colors.white,
                      ),
                      onPressed: () {
                        showSongMenuBottomSheet(context, song: song);
                      },
                    ),
                    onPressed: () {
                      context.read<PlayerBloc>().add(CreatePlayerEvent(
                        songs: widget.songs,
                        index: currentIndex,
                      ));
                    },
                  ),
                ),
              ],
            );
          }).toList(),
        );
      },
    );
  }
}
