import 'package:flutter/material.dart';
import 'package:persistent_bottom_nav_bar_v2/persistent-tab-view.dart';
import 'package:strongtify_mobile_app/models/artist/artist.dart';
import 'package:strongtify_mobile_app/ui/screens/artist_detail/artist_detail_screen.dart';

class SmallArtistItem extends StatefulWidget {
  const SmallArtistItem({
    super.key,
    required this.artist,
    this.onTap,
  });

  final Artist artist;
  final void Function()? onTap;

  @override
  State<SmallArtistItem> createState() => _SmallArtistItemState();
}

class _SmallArtistItemState extends State<SmallArtistItem> {
  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: () {
        if (widget.onTap != null) widget.onTap!();
      },
      leading: ClipOval(
        child: widget.artist.imageUrl != null
            ? Image.network(
                widget.artist.imageUrl!,
                fit: BoxFit.cover,
              )
            : Image.asset('assets/img/default-avatar.png'),
      ),
      title: Text(
        widget.artist.name,
        style: const TextStyle(color: Colors.white),
      ),
      contentPadding: const EdgeInsets.only(bottom: 5),
    );
  }
}
