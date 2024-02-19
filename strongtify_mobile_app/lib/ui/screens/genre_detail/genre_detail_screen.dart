import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:persistent_bottom_nav_bar_v2/persistent-tab-view.dart';
import 'package:share_plus/share_plus.dart';
import 'package:strongtify_mobile_app/common_blocs/get_albums/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/get_songs/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/ui/screens/album_list/album_list_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/genre_detail/bloc/bloc.dart';
import 'package:strongtify_mobile_app/ui/screens/song_list/song_list_screen.dart';
import 'package:strongtify_mobile_app/ui/widgets/album/album_grid.dart';
import 'package:strongtify_mobile_app/ui/widgets/song/song_list.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class GenreDetailScreen extends StatefulWidget {
  const GenreDetailScreen({
    super.key,
    required this.genreId,
  });

  final String genreId;

  @override
  State<GenreDetailScreen> createState() => _GenreDetailScreenState();
}

class _GenreDetailScreenState extends State<GenreDetailScreen> {
  @override
  Widget build(BuildContext context) {
    return BlocProvider<GenreDetailBloc>(
      create: (context) =>
          getIt<GenreDetailBloc>()..add(GetGenreByIdEvent(id: widget.genreId)),
      child: Scaffold(
        appBar: AppBar(
          foregroundColor: Colors.white,
          backgroundColor: ColorConstants.background,
          title: BlocBuilder<GenreDetailBloc, GenreDetailState>(
            builder: (context, GenreDetailState state) {
              return Text(
                !state.isLoading ? state.genre?.name ?? '' : '',
              );
            },
          ),
          actions: [
            BlocBuilder<GenreDetailBloc, GenreDetailState>(
              builder: (context, GenreDetailState state) {
                if (state.isLoading || state.genre == null) {
                  return const SizedBox();
                }

                return IconButton(
                  icon: const Icon(Icons.share),
                  tooltip: 'Chia sẻ',
                  onPressed: () {
                    final domain = dotenv.env['WEB_CLIENT_URL'] ?? '';
                    final genre = state.genre;

                    Share.share('$domain/genres/${genre!.alias}/${genre.id}');
                  },
                );
              },
            ),
          ],
        ),
        body: BlocBuilder<GenreDetailBloc, GenreDetailState>(
          builder: (context, GenreDetailState state) {
            if (!state.isLoading) {
              if (state.genre == null) {
                return const Center(
                  child: Text(
                    'Không có dữ liệu',
                    style: TextStyle(color: Colors.white70),
                  ),
                );
              }

              return _buildGenreDetailScreen(state);
            }

            return const Center(
              child: CircularProgressIndicator(
                color: ColorConstants.primary,
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildGenreDetailScreen(GenreDetailState state) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: double.infinity,
            height: 200,
            decoration: BoxDecoration(
              image: DecorationImage(
                image: state.genre?.imageUrl != null
                    ? NetworkImage(state.genre!.imageUrl!)
                    : const AssetImage('assets/img/default-song-img.png')
                        as ImageProvider,
              ),
            ),
          ),
          const SizedBox(height: 12),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ListTile(
                  onTap: () {
                    pushNewScreen(
                      context,
                      screen: SongListScreen(
                        event: GetSongsByParamsEvent(
                          genreId: widget.genreId,
                          sort: 'listenCount_desc',
                        ),
                      ),
                    );
                  },
                  iconColor: Colors.white,
                  textColor: Colors.white,
                  trailing: const Icon(Icons.arrow_forward_ios),
                  contentPadding: const EdgeInsets.only(right: 0, left: 0),
                  title: const Text(
                    'Bài hát nổi bật',
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 20,
                    ),
                  ),
                ),
                SongList(songs: state.genre!.songs ?? []),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ListTile(
                  onTap: () {
                    pushNewScreen(
                      context,
                      screen: AlbumListScreen(
                        event: GetAlbumsByParamsEvent(
                          genreId: widget.genreId,
                          sort: 'likeCount_desc',
                        ),
                      ),
                    );
                  },
                  iconColor: Colors.white,
                  textColor: Colors.white,
                  contentPadding: const EdgeInsets.only(right: 0, left: 0),
                  title: const Text(
                    'Album',
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 20,
                    ),
                  ),
                  trailing: const Icon(Icons.arrow_forward_ios),
                ),
                AlbumGrid(albums: state.genre!.albums ?? []),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
