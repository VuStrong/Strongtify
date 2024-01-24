import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/ui/widgets/song/song_item.dart';

class SongList extends StatefulWidget {
  const SongList({super.key, required this.songs});

  final List<Song> songs;

  @override
  State<SongList> createState() => _SongListState();
}

class _SongListState extends State<SongList> {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: widget.songs.map((song) => SongItem(song: song)).toList(),
    );
  }
}
