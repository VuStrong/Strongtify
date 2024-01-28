import 'package:flutter/material.dart';
import 'package:persistent_bottom_nav_bar/persistent_tab_view.dart';
import 'package:strongtify_mobile_app/models/artist/artist.dart';
import 'package:strongtify_mobile_app/ui/screens/artist/artist_detail_screen.dart';

class ArtistItem extends StatefulWidget {
  const ArtistItem({super.key, required this.artist});

  final Artist artist;

  @override
  State<ArtistItem> createState() => _ArtistItemState();
}

class _ArtistItemState extends State<ArtistItem> {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        PersistentNavBarNavigator.pushNewScreen(
          context,
          screen: ArtistDetailScreen(artistId: widget.artist.id),
        );
      },
      child: Card(
        color: Colors.grey.shade900,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              width: double.infinity,
              height: 150,
              child: ClipOval(
                child: widget.artist.imageUrl != null
                    ? Image.network(
                        widget.artist.imageUrl!,
                        fit: BoxFit.cover,
                      )
                    : Image.asset('assets/img/default-avatar.png'),
              ),
            ),
            ListTile(
              title: Text(
                widget.artist.name,
                maxLines: 2,
                style: const TextStyle(
                  color: Colors.white,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              subtitle: Text(
                '${widget.artist.followerCount} theo dõi',
                style: const TextStyle(
                  color: Colors.white30,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
