import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:share_plus/share_plus.dart';
import 'package:strongtify_mobile_app/blocs/artist/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/ui/widgets/album/album_list.dart';
import 'package:strongtify_mobile_app/ui/widgets/button.dart';
import 'package:strongtify_mobile_app/ui/widgets/song/song_list.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class ArtistDetailScreen extends StatefulWidget {
  const ArtistDetailScreen({
    super.key,
    required this.artistId,
  });

  final String artistId;

  @override
  State<ArtistDetailScreen> createState() => _ArtistDetailScreenState();
}

class _ArtistDetailScreenState extends State<ArtistDetailScreen> {
  @override
  Widget build(BuildContext context) {
    return BlocProvider<ArtistBloc>(
      create: (context) =>
          getIt<ArtistBloc>()..add(GetArtistByIdEvent(id: widget.artistId)),
      child: Scaffold(
        extendBodyBehindAppBar: true,
        appBar: AppBar(
          foregroundColor: Colors.white,
          backgroundColor: Colors.black.withOpacity(0.3),
          elevation: 0,
          actions: [
            BlocBuilder<ArtistBloc, ArtistState>(
              builder: (context, ArtistState state) {
                if (state is! LoadedArtistByIdState || state.artist == null) {
                  return const SizedBox();
                }

                return IconButton(
                  icon: const Icon(Icons.share),
                  tooltip: 'Chia sẻ',
                  onPressed: () {
                    final domain = dotenv.env['WEB_CLIENT_URL'] ?? '';
                    final artist = state.artist;

                    Share.share(
                        '$domain/artists/${artist!.alias}/${artist.id}');
                  },
                );
              },
            ),
          ],
        ),
        body: BlocBuilder<ArtistBloc, ArtistState>(
          builder: (context, ArtistState state) {
            if (state is LoadedArtistByIdState) {
              if (state.artist == null) {
                return const Center(
                  child: Text(
                    'Không có dữ liệu',
                    style: TextStyle(color: Colors.white70),
                  ),
                );
              }

              return _buildArtistDetailScreen(state);
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

  Widget _buildArtistDetailScreen(LoadedArtistByIdState state) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildArtistThumbnail(state),
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
                SongList(songs: state.artist!.songs ?? []),
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
                AlbumList(albums: state.artist!.albums ?? []),
              ],
            ),
          ),
          _buildArtistInfoFooter(state),
        ],
      ),
    );
  }

  Widget _buildArtistThumbnail(LoadedArtistByIdState state) {
    return AspectRatio(
      aspectRatio: 1,
      child: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          image: DecorationImage(
            fit: BoxFit.fill,
            image: state.artist?.imageUrl != null
                ? NetworkImage(state.artist!.imageUrl!)
                : const AssetImage('assets/img/default-avatar.png')
                    as ImageProvider,
          ),
        ),
        child: Align(
          alignment: Alignment.bottomCenter,
          child: Container(
            padding: const EdgeInsets.only(
              top: 10,
              bottom: 10,
              right: 20,
              left: 20,
            ),
            width: double.infinity,
            height: 140,
            decoration: BoxDecoration(color: Colors.black.withOpacity(0.3)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  state.artist!.name,
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 25,
                      fontWeight: FontWeight.bold),
                ),
                Text(
                  '${state.artist!.followerCount} theo dõi',
                  style: const TextStyle(
                    color: Colors.white70,
                  ),
                ),
                const SizedBox(height: 12),
                Button(
                  width: 120,
                  isOutlined: true,
                  buttonText: 'Theo dõi',
                  onPressed: () {
                    //
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildArtistInfoFooter(LoadedArtistByIdState state) {
    return Padding(
      padding: const EdgeInsets.only(
        top: 20,
        right: 20,
        left: 20,
        bottom: 80,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Thông tin',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w700,
              fontSize: 20,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            state.artist!.about ?? '',
            style: const TextStyle(
              color: Colors.white54,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              const SizedBox(
                width: 70,
                child: Text(
                  'Tên:',
                  style: TextStyle(color: Colors.white),
                ),
              ),
              const SizedBox(width: 50),
              Text(
                state.artist!.name,
                style: const TextStyle(color: Colors.white54),
              )
            ],
          ),
          const SizedBox(height: 10),
          state.artist!.birthDate != null
              ? Row(
                  children: [
                    const SizedBox(
                      width: 70,
                      child: Text(
                        'Ngày sinh:',
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                    const SizedBox(width: 50),
                    Text(
                      '${state.artist!.birthDate!.day}/${state.artist!.birthDate!.month}/${state.artist!.birthDate!.year}',
                      style: const TextStyle(color: Colors.white54),
                    )
                  ],
                )
              : const SizedBox(),
        ],
      ),
    );
  }
}
