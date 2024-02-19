import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist.dart';
import 'package:strongtify_mobile_app/ui/widgets/playlist/playlist_item.dart';

class PlaylistGrid extends StatefulWidget {
  const PlaylistGrid({super.key, required this.playlists});

  final List<Playlist> playlists;

  @override
  State<PlaylistGrid> createState() => _PlaylistGridState();
}

class _PlaylistGridState extends State<PlaylistGrid> {
  @override
  Widget build(BuildContext context) {
    if (widget.playlists.isEmpty) {
      return const Text(
        'Không có dữ liệu',
        style: TextStyle(color: Colors.white54),
      );
    }

    return GridView.builder(
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
      itemBuilder: (_, index) =>
          PlaylistItem(playlist: widget.playlists[index]),
    );
  }
}
