import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:share_plus/share_plus.dart';
import 'package:strongtify_mobile_app/blocs/album/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/models/artist/artist.dart';
import 'package:strongtify_mobile_app/ui/widgets/song/song_list.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';
import 'package:strongtify_mobile_app/utils/extensions.dart';

class AlbumDetailScreen extends StatefulWidget {
  const AlbumDetailScreen({
    super.key,
    required this.albumId,
  });

  final String albumId;

  @override
  State<AlbumDetailScreen> createState() => _AlbumDetailScreenState();
}

class _AlbumDetailScreenState extends State<AlbumDetailScreen> {
  @override
  Widget build(BuildContext context) {
    return BlocProvider<AlbumBloc>(
      create: (context) =>
          getIt<AlbumBloc>()..add(GetAlbumByIdEvent(id: widget.albumId)),
      child: Scaffold(
        appBar: AppBar(
          foregroundColor: Colors.white,
          backgroundColor: ColorConstants.background,
          title: BlocBuilder<AlbumBloc, AlbumState>(
            builder: (context, AlbumState state) {
              return Text(
                state is LoadAlbumByIdState && !state.isLoading
                    ? state.album?.name ?? ''
                    : '',
              );
            },
          ),
          actions: [
            BlocBuilder<AlbumBloc, AlbumState>(
              builder: (context, AlbumState state) {
                if (state is! LoadAlbumByIdState ||
                    state.isLoading ||
                    state.album == null) {
                  return const SizedBox();
                }

                return IconButton(
                  icon: const Icon(Icons.share),
                  tooltip: 'Chia sẻ',
                  onPressed: () {
                    final domain = dotenv.env['WEB_CLIENT_URL'] ?? '';
                    final album = state.album;

                    Share.share('$domain/albums/${album!.alias}/${album.id}');
                  },
                );
              },
            ),
          ],
        ),
        body: BlocBuilder<AlbumBloc, AlbumState>(
          builder: (context, AlbumState state) {
            if (state is LoadAlbumByIdState && !state.isLoading) {
              if (state.album == null) {
                return const Center(
                  child: Text(
                    'Không có dữ liệu',
                    style: TextStyle(color: Colors.white70),
                  ),
                );
              }

              return _buildAlbumDetailScreen(context, state);
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

  Widget _buildAlbumDetailScreen(
    BuildContext context,
    LoadAlbumByIdState state,
  ) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Center(
              child: Container(
                width: MediaQuery.of(context).size.width * 0.6,
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.5),
                      spreadRadius: 5,
                      blurRadius: 20,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: state.album!.imageUrl != null
                    ? Image.network(
                        state.album!.imageUrl!,
                        fit: BoxFit.cover,
                      )
                    : Image.asset('assets/img/default-song-img.png'),
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              '(Album)',
              style: TextStyle(color: Colors.white54),
            ),
            Text(
              state.album!.name,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 20,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            _buildAlbumArtist(state.album!.artist),
            const SizedBox(height: 8),
            Text(
              '${state.album!.songCount} bài hát - ${state.album!.totalLength.toFormattedLength()}',
              style: const TextStyle(
                color: Colors.white70,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 5),
            Text(
              '${state.album!.likeCount} lượt thích',
              style: const TextStyle(
                color: Colors.white70,
              ),
            ),
            const SizedBox(height: 15),
            SongList(songs: state.album!.songs ?? []),
          ],
        ),
      ),
    );
  }

  Widget _buildAlbumArtist(Artist? artist) {
    if (artist == null) {
      return const Text(
        'Strongtify',
        style: TextStyle(
          color: Colors.white70,
        ),
        textAlign: TextAlign.center,
      );
    }

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        SizedBox(
          width: 24,
          height: 24,
          child: ClipOval(
            child: artist.imageUrl != null
                ? Image.network(
                    artist.imageUrl!,
                    fit: BoxFit.cover,
                  )
                : Image.asset('assets/img/default-avatar.png'),
          ),
        ),
        const SizedBox(width: 5),
        Text(
          artist.name,
          style: const TextStyle(
            color: Colors.white54,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}
