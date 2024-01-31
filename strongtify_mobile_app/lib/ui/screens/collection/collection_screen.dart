import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:persistent_bottom_nav_bar/persistent_tab_view.dart';
import 'package:strongtify_mobile_app/common_blocs/playlists/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/ui/screens/playlist_list/playlist_list_screen.dart';
import 'package:strongtify_mobile_app/ui/widgets/app_drawer.dart';
import 'package:strongtify_mobile_app/ui/widgets/appbar_account.dart';
import 'package:strongtify_mobile_app/ui/widgets/playlist/playlist_list.dart';
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
    return BlocProvider<PlaylistsBloc>(
      create: (context) =>
          getIt<PlaylistsBloc>()..add(GetCurrentUserPlaylistsEvent()),
      child: Scaffold(
        appBar: AppBar(
          title: const Text(
            'Bộ sưu tập',
            style: TextStyle(color: Colors.white),
          ),
          backgroundColor: ColorConstants.background,
          leading: const AppbarAccount(),
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
                  //
                },
              ),
              ListTile(
                textColor: Colors.white70,
                iconColor: Colors.white70,
                leading: const Icon(Icons.library_music),
                title: const Text('Album đã thích'),
                trailing: const Icon(Icons.arrow_forward_ios),
                onTap: () {
                  //
                },
              ),
              ListTile(
                textColor: Colors.white70,
                iconColor: Colors.white70,
                leading: const Icon(Icons.group),
                title: const Text('Nghệ sĩ đang theo dõi'),
                trailing: const Icon(Icons.arrow_forward_ios),
                onTap: () {
                  //
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
                        PersistentNavBarNavigator.pushNewScreen(
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
                      title: const Text(
                        'Playlist của tôi',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 20,
                        ),
                      ),
                    ),
                    BlocBuilder<PlaylistsBloc, PlaylistsState>(
                      builder: (context, PlaylistsState state) {
                        if (state is LoadPlaylistsState &&
                            state.status == LoadPlaylistsStatus.loaded) {
                          return PlaylistList(playlists: state.playlists ?? []);
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
      ),
    );
  }
}
