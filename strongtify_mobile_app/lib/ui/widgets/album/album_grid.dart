import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/models/album/album.dart';
import 'package:strongtify_mobile_app/ui/widgets/album/album_item.dart';

class AlbumGrid extends StatefulWidget {
  const AlbumGrid({super.key, required this.albums});

  final List<Album> albums;

  @override
  State<AlbumGrid> createState() => _AlbumGridState();
}

class _AlbumGridState extends State<AlbumGrid> {
  @override
  Widget build(BuildContext context) {
    if (widget.albums.isEmpty) {
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
      itemCount: widget.albums.length,
      physics: const NeverScrollableScrollPhysics(),
      itemBuilder: (_, index) => AlbumItem(album: widget.albums[index]),
    );
  }
}
