import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/ui/widgets/song/song_item.dart';

class SongList extends StatefulWidget {
  const SongList({super.key, required this.songs, this.showOrder = false});

  final List<Song> songs;
  final bool showOrder;

  @override
  State<SongList> createState() => _SongListState();
}

class _SongListState extends State<SongList> {
  @override
  Widget build(BuildContext context) {
    if (!widget.showOrder) {
      return Column(
        children: widget.songs.map((song) => SongItem(song: song)).toList(),
      );
    }

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

        return Row(
          children: [
            numberWidget,
            const SizedBox(width: 10),
            Expanded(
              child: SongItem(song: song),
            ),
          ],
        );
      }).toList(),
    );
  }
}
