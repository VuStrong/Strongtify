import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:share_plus/share_plus.dart';
import 'package:strongtify_mobile_app/blocs/genre/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/ui/widgets/album/album_list.dart';
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
    return BlocProvider<GenreBloc>(
      create: (context) =>
          getIt<GenreBloc>()..add(GetGenreByIdEvent(id: widget.genreId)),
      child: Scaffold(
        appBar: AppBar(
          foregroundColor: Colors.white,
          backgroundColor: ColorConstants.background,
          title: BlocBuilder<GenreBloc, GenreState>(
            builder: (context, GenreState state) {
              return Text(
                state is LoadedGenreByIdState ? state.genre?.name ?? '' : '',
              );
            },
          ),
          actions: [
            BlocBuilder<GenreBloc, GenreState>(
              builder: (context, GenreState state) {
                if (state is! LoadedGenreByIdState || state.genre == null) {
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
        body: BlocBuilder<GenreBloc, GenreState>(
          builder: (context, GenreState state) {
            if (state is LoadedGenreByIdState) {
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

  Widget _buildGenreDetailScreen(LoadedGenreByIdState state) {
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
                const Text(
                  'Bài hát nổi bật',
                  textAlign: TextAlign.start,
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 20,
                  ),
                ),
                const SizedBox(height: 16),
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
                const Text(
                  'Album',
                  textAlign: TextAlign.start,
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 20,
                  ),
                ),
                const SizedBox(height: 16),
                AlbumList(albums: state.genre!.albums ?? []),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
