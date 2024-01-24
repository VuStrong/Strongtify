import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist.dart';
import 'package:strongtify_mobile_app/ui/widgets/playlist/playlist_item.dart';

class PlaylistList extends StatefulWidget {
  const PlaylistList({super.key, required this.playlists});

  final List<Playlist> playlists;

  @override
  State<PlaylistList> createState() => _PlaylistListState();
}

class _PlaylistListState extends State<PlaylistList> {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 830,
      child: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          mainAxisExtent: 270,
          mainAxisSpacing: 10,
          crossAxisSpacing: 10,
        ),
        shrinkWrap: true,
        padding: EdgeInsets.zero,
        itemCount: widget.playlists.length,
        physics: const NeverScrollableScrollPhysics(),
        itemBuilder: (_, index) => PlaylistItem(playlist: widget.playlists[index]),
      ),
    );
  }
}
