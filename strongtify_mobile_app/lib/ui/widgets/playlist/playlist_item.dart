import 'package:flutter/material.dart';
import 'package:persistent_bottom_nav_bar_v2/persistent-tab-view.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist.dart';
import 'package:strongtify_mobile_app/ui/screens/playlist_detail/playlist_detail_screen.dart';

class PlaylistItem extends StatefulWidget {
  const PlaylistItem({super.key, required this.playlist});

  final Playlist playlist;

  @override
  State<PlaylistItem> createState() => _PlaylistItemState();
}

class _PlaylistItemState extends State<PlaylistItem> {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        pushNewScreen(
          context,
          screen: PlaylistDetailScreen(playlistId: widget.playlist.id),
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
                child: widget.playlist.imageUrl != null
                    ? Image.network(
                        widget.playlist.imageUrl!,
                        fit: BoxFit.cover,
                      )
                    : Image.asset('assets/img/default-song-img.png'),
              ),
            ),
            ListTile(
              title: Text(
                widget.playlist.name,
                maxLines: 2,
                style: const TextStyle(
                  color: Colors.white,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              subtitle: Row(
                children: [
                  SizedBox(
                    width: 24,
                    height: 24,
                    child: ClipOval(
                      child: widget.playlist.user.imageUrl != null
                          ? Image.network(
                              widget.playlist.user.imageUrl!,
                              fit: BoxFit.cover,
                            )
                          : Image.asset('assets/img/default-avatar.png'),
                    ),
                  ),
                  const SizedBox(width: 5),
                  Text(
                    widget.playlist.user.name,
                    style: const TextStyle(
                      color: Colors.white30,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
