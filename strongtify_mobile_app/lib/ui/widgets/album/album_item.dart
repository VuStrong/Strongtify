import 'package:flutter/material.dart';
import 'package:persistent_bottom_nav_bar_v2/persistent-tab-view.dart';
import 'package:strongtify_mobile_app/models/album/album.dart';
import 'package:strongtify_mobile_app/ui/screens/album_detail/album_detail_screen.dart';

class AlbumItem extends StatefulWidget {
  const AlbumItem({super.key, required this.album});

  final Album album;

  @override
  State<AlbumItem> createState() => _AlbumItemState();
}

class _AlbumItemState extends State<AlbumItem> {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        pushNewScreen(
          context,
          screen: AlbumDetailScreen(albumId: widget.album.id),
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
              child: ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: widget.album.imageUrl != null
                    ? Image.network(
                        widget.album.imageUrl!,
                        fit: BoxFit.cover,
                      )
                    : Image.asset('assets/img/default-song-img.png'),
              ),
            ),
            ListTile(
              title: Text(
                widget.album.name,
                maxLines: 2,
                style: const TextStyle(
                  color: Colors.white,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              subtitle: Text(
                widget.album.artist?.name ?? 'Strongtify',
                style: const TextStyle(
                  color: Colors.white30,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
