import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:persistent_bottom_nav_bar_v2/persistent-tab-view.dart';
import 'package:strongtify_mobile_app/common_blocs/auth/auth_bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/get_albums/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/get_artists/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/get_playlists/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/get_songs/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/user_recent_playlists/bloc.dart';
import 'package:strongtify_mobile_app/ui/screens/album_list/album_list_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/artist_list/artist_list_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/create_playlist/create_playlist_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/playlist_list/playlist_list_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/song_list/song_list_screen.dart';
import 'package:strongtify_mobile_app/ui/widgets/app_drawer.dart';
import 'package:strongtify_mobile_app/ui/widgets/appbar_account.dart';
import 'package:strongtify_mobile_app/ui/widgets/playlist/playlist_grid.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class CollectionScreen extends StatefulWidget {
  const CollectionScreen({super.key});

  static String id = 'collection_screen';

  @override
  State<CollectionScreen> createState() => _CollectionScreenState();
}

class _CollectionScreenState extends State<CollectionScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Bộ sưu tập',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: ColorConstants.background,
        leading: const AppbarAccount(),
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            onPressed: () {
              _showAddMenuBottomSheet(context);
            },
            icon: const Icon(Icons.add),
          ),
        ],
      ),
      drawer: const AppDrawer(),
      body: SingleChildScrollView(
        child: Column(
          children: [
            ListTile(
              textColor: Colors.white70,
              iconColor: Colors.white70,
              leading: const Icon(Icons.favorite),
              title: const Text('Bài hát đã thích'),
              trailing: const Icon(Icons.arrow_forward_ios),
              onTap: () {
                pushNewScreen(
                  context,
                  screen: SongListScreen(
                    title: 'Bài hát đã thích',
                    event: GetCurrentUserLikedSongsEvent(),
                  ),
                );
              },
            ),
            ListTile(
              textColor: Colors.white70,
              iconColor: Colors.white70,
              leading: const Icon(Icons.library_music),
              title: const Text('Album đã thích'),
              trailing: const Icon(Icons.arrow_forward_ios),
              onTap: () {
                pushNewScreen(
                  context,
                  screen: AlbumListScreen(
                    title: 'Album đã thích',
                    event: GetCurrentUserLikedAlbumsEvent(),
                  ),
                );
              },
            ),
            ListTile(
              textColor: Colors.white70,
              iconColor: Colors.white70,
              leading: const Icon(Icons.library_music),
              title: const Text('Playlist đã thích'),
              trailing: const Icon(Icons.arrow_forward_ios),
              onTap: () {
                pushNewScreen(
                  context,
                  screen: PlaylistListScreen(
                    title: 'Playlist đã thích',
                    event: GetCurrentUserLikedPlaylistsEvent(),
                  ),
                );
              },
            ),
            ListTile(
              textColor: Colors.white70,
              iconColor: Colors.white70,
              leading: const Icon(Icons.group),
              title: const Text('Nghệ sĩ đang theo dõi'),
              trailing: const Icon(Icons.arrow_forward_ios),
              onTap: () {
                pushNewScreen(
                  context,
                  screen: ArtistListScreen(
                    title: 'Nghệ sĩ đang theo dõi',
                    event: GetFollowingArtistsEvent(
                        userId: context.read<AuthBloc>().state.user!.id),
                  ),
                );
              },
            ),
            const SizedBox(height: 32),
            Padding(
              padding: const EdgeInsets.only(right: 16, left: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ListTile(
                    onTap: () {
                      pushNewScreen(
                        context,
                        screen: PlaylistListScreen(
                          title: 'Playlist của tôi',
                          event: GetCurrentUserPlaylistsEvent(),
                        ),
                      );
                    },
                    iconColor: Colors.white,
                    textColor: Colors.white,
                    trailing: const Icon(Icons.arrow_forward_ios),
                    contentPadding: const EdgeInsets.only(right: 0, left: 0),
                    title: const Text(
                      'Playlist của tôi',
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 20,
                      ),
                    ),
                  ),
                  BlocBuilder<UserRecentPlaylistsBloc,
                      UserRecentPlaylistsState>(
                    builder: (context, UserRecentPlaylistsState state) {
                      if (!state.isLoading) {
                        return PlaylistGrid(playlists: state.playlists);
                      }

                      return const Center(
                        child: CircularProgressIndicator(),
                      );
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  void _showAddMenuBottomSheet(BuildContext context) {
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
              ListTile(
                leading: const Icon(Icons.playlist_add),
                textColor: Colors.white70,
                iconColor: Colors.white70,
                title: const Text('Tạo danh sách phát mới'),
                onTap: () async {
                  Navigator.pop(context);

                  pushNewScreen(
                    context,
                    screen: const CreatePlaylistScreen(),
                    withNavBar: false,
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
