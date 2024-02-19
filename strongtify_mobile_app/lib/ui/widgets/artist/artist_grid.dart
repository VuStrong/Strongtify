import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/models/artist/artist.dart';
import 'package:strongtify_mobile_app/ui/widgets/artist/artist_item.dart';

class ArtistGrid extends StatefulWidget {
  const ArtistGrid({super.key, required this.artists});

  final List<Artist> artists;

  @override
  State<ArtistGrid> createState() => _ArtistGridState();
}

class _ArtistGridState extends State<ArtistGrid> {
  @override
  Widget build(BuildContext context) {
    if (widget.artists.isEmpty) {
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
      itemCount: widget.artists.length,
      physics: const NeverScrollableScrollPhysics(),
      itemBuilder: (_, index) => ArtistItem(artist: widget.artists[index]),
    );
  }
}
