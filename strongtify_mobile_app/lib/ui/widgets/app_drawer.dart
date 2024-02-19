import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:persistent_bottom_nav_bar_v2/persistent-tab-view.dart';
import 'package:strongtify_mobile_app/common_blocs/auth/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/user_recent_playlists/bloc.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist.dart';
import 'package:strongtify_mobile_app/ui/screens/create_playlist/create_playlist_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/playlist_detail/playlist_detail_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/profile/profile_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/settings/settings_screen.dart';
import 'package:strongtify_mobile_app/ui/widgets/playlist/small_playlist_item.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: Colors.grey.shade900,
      child: ListView(
        padding: const EdgeInsets.only(
          right: 0,
          left: 0,
          top: 35,
        ),
        children: [
          BlocBuilder<AuthBloc, AuthState>(
            builder: (context, AuthState state) {
              if (state.user != null) {
                return ListTile(
                  onTap: () {
                    pushNewScreen(
                      context,
                      screen: ProfileScreen(
                        userId: state.user!.id,
                      ),
                    );
                  },
                  leading: ClipOval(
                    child: state.user!.imageUrl != null
                        ? Image.network(
                            state.user!.imageUrl!,
                            fit: BoxFit.cover,
                          )
                        : Image.asset('assets/img/default-avatar.png'),
                  ),
                  title: Text(
                    state.user!.name,
                    style: const TextStyle(color: Colors.white),
                  ),
                  subtitle: const Text(
                    'Xem hồ sơ',
                    style: TextStyle(color: Colors.white54),
                  ),
                );
              }

              return const SizedBox();
            },
          ),
          const SizedBox(height: 12),
          const Divider(
            height: 1,
            thickness: 1,
            color: Colors.white30,
          ),
          ListTile(
            textColor: Colors.white70,
            iconColor: Colors.white70,
            leading: const Icon(Icons.settings),
            title: const Text('Cài đặt'),
            onTap: () {
              pushNewScreen(
                context,
                screen: const SettingsScreen(),
              );
            },
          ),
          const Divider(
            height: 1,
            thickness: 1,
            color: Colors.white30,
          ),
          BlocBuilder<UserRecentPlaylistsBloc, UserRecentPlaylistsState>(
            builder: (context, UserRecentPlaylistsState state) {
              if (!state.isLoading) {
                return _buildDrawerPlaylists(context, state.playlists);
              }

              return const SizedBox();
            },
          ),
        ],
      ),
    );
  }

  Widget _buildDrawerPlaylists(BuildContext context, List<Playlist> playlists) {
    return Padding(
      padding: const EdgeInsets.all(10),
      child: Column(
        children: [
          ListTile(
            onTap: () {
              pushNewScreen(
                context,
                screen: const CreatePlaylistScreen(),
                withNavBar: false,
              );
            },
            leading: Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: Colors.grey[850],
              ),
              child: const Center(
                child: Icon(Icons.add, color: Colors.white),
              ),
            ),
            title: const Text(
              'Tạo playlist mới',
              style: TextStyle(color: Colors.white),
            ),
            contentPadding: const EdgeInsets.only(right: 0, left: 5),
          ),
          ...playlists.map(
            (playlist) => SmallPlaylistItem(
              playlist: playlist,
              onTap: () {
                pushNewScreen(
                  context,
                  screen: PlaylistDetailScreen(playlistId: playlist.id),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
