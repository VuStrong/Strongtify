import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:persistent_bottom_nav_bar_v2/persistent-tab-view.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:share_plus/share_plus.dart';
import 'package:strongtify_mobile_app/common_blocs/get_playlists/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/playlist_songs/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/user_favs/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/ui/screens/artist_detail/artist_detail_screen.dart';
import 'package:strongtify_mobile_app/ui/widgets/artist/small_artist_item.dart';
import 'package:strongtify_mobile_app/ui/widgets/bottom_navigation_app.dart';
import 'package:strongtify_mobile_app/ui/widgets/playlist/small_playlist_item.dart';
import 'package:strongtify_mobile_app/ui/widgets/song/song_item.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

void showSongMenuBottomSheet(
  BuildContext context, {
  required Song song,
  List<Widget> Function(BuildContext context)? anotherOptions,
  void Function()? onTapArtist,
}) {
  showModalBottomSheet(
    context: context,
    backgroundColor: Colors.grey[850],
    useRootNavigator: true,
    builder: (bottomSheetContext) {
      final options = anotherOptions != null
          ? anotherOptions(bottomSheetContext)
          : <Widget>[];

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
            ...options,
            BlocBuilder<UserFavsBloc, UserFavsState>(
              builder: (context, UserFavsState state) {
                final liked = state.data.likedSongIds.contains(song.id);

                return ListTile(
                  leading: liked
                      ? const Icon(Icons.favorite)
                      : const Icon(Icons.favorite_border),
                  textColor: Colors.white70,
                  iconColor: Colors.white70,
                  title: Text(liked
                      ? 'Xóa khỏi danh sách yêu thích'
                      : 'Thêm vào danh sách yêu thích'),
                  onTap: () async {
                    Navigator.pop(context);

                    if (liked) {
                      context.read<UserFavsBloc>().add(UnlikeSongEvent(
                            songId: song.id,
                          ));
                    } else {
                      context.read<UserFavsBloc>().add(LikeSongEvent(
                            songId: song.id,
                          ));
                    }
                  },
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.add_circle_outline_outlined),
              textColor: Colors.white70,
              iconColor: Colors.white70,
              title: const Text('Thêm vào danh sách phát'),
              onTap: () async {
                Navigator.pop(bottomSheetContext);

                _showAddSongToPlaylistBottomSheet(context, song);
              },
            ),
            ListTile(
              leading: const Icon(Icons.person_search),
              textColor: Colors.white70,
              iconColor: Colors.white70,
              title: const Text('Xem nghệ sĩ'),
              onTap: () async {
                Navigator.pop(bottomSheetContext);

                _showSelectSongArtistBottomSheet(
                  context,
                  song,
                  onTapArtist: onTapArtist,
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.share),
              textColor: Colors.white70,
              iconColor: Colors.white70,
              title: const Text('Chia sẻ'),
              onTap: () async {
                Navigator.pop(bottomSheetContext);

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

void _showSelectSongArtistBottomSheet(
  BuildContext context,
  Song song, {
  void Function()? onTapArtist,
}) {
  showModalBottomSheet(
    context: context,
    backgroundColor: Colors.grey[850],
    useRootNavigator: true,
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
                    ?.map(
                      (artist) => SmallArtistItem(
                        artist: artist,
                        onTap: () {
                          Navigator.pop(context);

                          if (onTapArtist != null) onTapArtist();

                          pushNewScreen(
                            BottomNavigationApp.tabContext,
                            screen: ArtistDetailScreen(artistId: artist.id),
                          );
                        },
                      ),
                    )
                    .toList() ??
                [],
          ],
        ),
      );
    },
  );
}

void _showAddSongToPlaylistBottomSheet(BuildContext context, Song song) {
  showModalBottomSheet(
    context: context,
    backgroundColor: Colors.grey[850],
    useRootNavigator: true,
    builder: (context) {
      return _AddSongToPlaylistsContent(
        onTapPlaylist: (String playlistId) {
          context.read<PlaylistSongsBloc>().add(AddSongToPlaylistEvent(
                playlistId: playlistId,
                song: song,
              ));

          Navigator.pop(context);
        },
      );
    },
  );
}

class _AddSongToPlaylistsContent extends StatelessWidget {
  _AddSongToPlaylistsContent({
    required this.onTapPlaylist,
  });

  final RefreshController _refreshController =
      RefreshController(initialRefresh: false);

  final void Function(String playlistId) onTapPlaylist;

  @override
  Widget build(BuildContext context) {
    return BlocProvider<GetPlaylistsBloc>(
      create: (context) => getIt<GetPlaylistsBloc>()
        ..add(GetCurrentUserPlaylistsEvent(take: 10)),
      child: Padding(
        padding:
            const EdgeInsets.only(top: 20, bottom: 20, left: 15, right: 15),
        child: Column(
          children: [
            const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Thêm bài hát vào playlist',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            BlocBuilder<GetPlaylistsBloc, GetPlaylistsState>(
              builder: (context, GetPlaylistsState state) {
                return SearchBar(
                  padding: const MaterialStatePropertyAll<EdgeInsets>(
                    EdgeInsets.symmetric(horizontal: 14.0),
                  ),
                  leading: const Icon(Icons.search),
                  hintText: 'Tìm kiếm danh sách phát',
                  onSubmitted: (String value) {
                    context
                        .read<GetPlaylistsBloc>()
                        .add(GetCurrentUserPlaylistsEvent(
                          keyword: value,
                          take: 10,
                        ));
                  },
                );
              },
            ),
            const SizedBox(height: 12),
            const Divider(
              height: 1,
              thickness: 1,
              color: Colors.white30,
            ),
            const SizedBox(height: 12),
            BlocConsumer<GetPlaylistsBloc, GetPlaylistsState>(
              listener: (context, GetPlaylistsState state) {
                if (state.status != LoadPlaylistsStatus.loaded) {
                  return;
                }

                if (state.end) {
                  _refreshController.loadNoData();
                } else {
                  _refreshController.loadComplete();
                }
              },
              builder: (context, GetPlaylistsState state) {
                if (state.status == LoadPlaylistsStatus.loading) {
                  return const Center(
                    child: CircularProgressIndicator(
                      color: ColorConstants.primary,
                    ),
                  );
                }

                if (state.playlists == null || state.playlists!.isEmpty) {
                  return const Text(
                    'Không có danh sách phát',
                    style: TextStyle(color: Colors.white70),
                  );
                }

                return _buildPlaylistList(context, state.playlists!);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaylistList(BuildContext context, List<Playlist> playlists) {
    return Expanded(
      child: SmartRefresher(
        enablePullUp: true,
        enablePullDown: false,
        footer: CustomFooter(
          builder: (BuildContext context, LoadStatus? mode) {
            late final Widget body;

            if (mode == LoadStatus.loading) {
              body = const CircularProgressIndicator(
                color: ColorConstants.primary,
              );
            } else {
              body = const SizedBox.shrink();
            }

            return SizedBox(
              height: 55,
              child: Center(child: body),
            );
          },
        ),
        controller: _refreshController,
        onLoading: () {
          context.read<GetPlaylistsBloc>().add(GetMorePlaylistsEvent());
        },
        child: ListView(
          children: playlists
              .map(
                (playlist) => SmallPlaylistItem(
                  playlist: playlist,
                  onTap: () {
                    onTapPlaylist(playlist.id);
                  },
                ),
              )
              .toList(),
        ),
      ),
    );
  }
}
