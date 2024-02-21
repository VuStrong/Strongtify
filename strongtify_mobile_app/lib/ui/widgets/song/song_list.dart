import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/player/bloc.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/ui/widgets/song/song_item.dart';
import 'package:strongtify_mobile_app/utils/bottom_sheet/song_menu_bottom_sheet.dart';

class SongList extends StatefulWidget {
  const SongList({
    super.key,
    required this.songs,
  });

  final List<Song> songs;

  @override
  State<SongList> createState() => _SongListState();
}

class _SongListState extends State<SongList> {
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
        int index = -1;

        return Column(
          children: widget.songs.map((song) {
            index++;

            int currentIndex = index;

            return SongItem(
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
            );
          }).toList(),
        );
      },
    );
  }
}
