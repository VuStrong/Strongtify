import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/models/artist/artist.dart';
import 'package:strongtify_mobile_app/ui/widgets/artist/artist_item.dart';

class ArtistList extends StatefulWidget {
  const ArtistList({super.key, required this.artists});

  final List<Artist> artists;

  @override
  State<ArtistList> createState() => _ArtistListState();
}

class _ArtistListState extends State<ArtistList> {
  @override
  Widget build(BuildContext context) {
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
