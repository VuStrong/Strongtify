import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/models/album/album.dart';
import 'package:strongtify_mobile_app/ui/widgets/album/album_item.dart';

class AlbumList extends StatefulWidget {
  const AlbumList({super.key, required this.albums});

  final List<Album> albums;

  @override
  State<AlbumList> createState() => _AlbumListState();
}

class _AlbumListState extends State<AlbumList> {
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
        itemCount: widget.albums.length,
        physics: const NeverScrollableScrollPhysics(),
        itemBuilder: (_, index) => AlbumItem(album: widget.albums[index]),
      ),
    );
  }
}
