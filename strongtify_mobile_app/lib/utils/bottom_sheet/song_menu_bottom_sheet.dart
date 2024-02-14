import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:persistent_bottom_nav_bar/persistent_tab_view.dart';
import 'package:share_plus/share_plus.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/ui/screens/artist_detail/artist_detail_screen.dart';
import 'package:strongtify_mobile_app/ui/widgets/song/song_item.dart';

void showSongMenuBottomSheet(
  BuildContext context, {
  required Song song,
}) {
  showModalBottomSheet(
    context: context,
    backgroundColor: Colors.grey[850],
    useRootNavigator: true,
    builder: (context) {
      return Padding(
        padding:
            const EdgeInsets.only(top: 20, bottom: 20, right: 12, left: 12),
        child: Wrap(
          children: [
            SongItem(song: song),
            const Divider(
              height: 1,
              thickness: 1,
              color: Colors.white30,
            ),
            ListTile(
              leading: const Icon(Icons.person_search),
              textColor: Colors.white70,
              iconColor: Colors.white70,
              title: const Text('Xem nghệ sĩ'),
              onTap: () async {
                Navigator.pop(context);

                _showSelectSongArtistBottomSheet(context, song);
              },
            ),
            ListTile(
              leading: const Icon(Icons.share),
              textColor: Colors.white70,
              iconColor: Colors.white70,
              title: const Text('Chia sẻ'),
              onTap: () async {
                Navigator.pop(context);

                final domain = dotenv.env['WEB_CLIENT_URL'] ?? '';

                Share.share('$domain/songs/${song.alias}/${song.id}');
              },
            ),
          ],
        ),
      );
    },
  );
}

void _showSelectSongArtistBottomSheet(BuildContext context, Song song) {
  showModalBottomSheet(
    context: context,
    backgroundColor: Colors.grey[850],
    builder: (context) {
      return Padding(
        padding:
            const EdgeInsets.only(top: 20, bottom: 20, left: 15, right: 15),
        child: Wrap(
          children: [
            const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Nghệ sĩ',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
              ],
            ),
            ...song.artists
                    ?.map((artist) => ListTile(
                          onTap: () {
                            Navigator.pop(context);

                            PersistentNavBarNavigator.pushNewScreen(
                              context,
                              screen: ArtistDetailScreen(
                                artistId: artist.id,
                              ),
                            );
                          },
                          leading: ClipOval(
                            child: artist.imageUrl != null
                                ? Image.network(
                                    artist.imageUrl!,
                                    fit: BoxFit.cover,
                                  )
                                : Image.asset('assets/img/default-avatar.png'),
                          ),
                          title: Text(
                            artist.name,
                            style: const TextStyle(color: Colors.white),
                          ),
                          contentPadding: const EdgeInsets.only(bottom: 5),
                        ))
                    .toList() ??
                [],
          ],
        ),
      );
    },
  );
}
