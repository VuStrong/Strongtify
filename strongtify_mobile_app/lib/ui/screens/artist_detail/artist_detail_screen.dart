import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:persistent_bottom_nav_bar/persistent_tab_view.dart';
import 'package:share_plus/share_plus.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/ui/screens/album_list/album_list_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/artist_detail/bloc/bloc.dart';
import 'package:strongtify_mobile_app/ui/screens/song_list/song_list_screen.dart';
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
    return BlocProvider<ArtistDetailBloc>(
      create: (context) => getIt<ArtistDetailBloc>()
        ..add(GetArtistByIdEvent(id: widget.artistId)),
      child: Scaffold(
        extendBodyBehindAppBar: true,
        appBar: AppBar(
          foregroundColor: Colors.white,
          backgroundColor: Colors.black.withOpacity(0.3),
          elevation: 0,
          actions: [
            BlocBuilder<ArtistDetailBloc, ArtistDetailState>(
              builder: (context, ArtistDetailState state) {
                if (state.isLoading || state.artist == null) {
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
        body: BlocBuilder<ArtistDetailBloc, ArtistDetailState>(
          builder: (context, ArtistDetailState state) {
            if (!state.isLoading) {
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

  Widget _buildArtistDetailScreen(ArtistDetailState state) {
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
                ListTile(
                  onTap: () {
                    PersistentNavBarNavigator.pushNewScreen(
                      context,
                      screen: SongListScreen(
                        sort: 'createdAt_desc',
                        artistId: widget.artistId,
                      ),
                    );
                  },
                  iconColor: Colors.white,
                  textColor: Colors.white,
                  trailing: const Icon(Icons.arrow_forward_ios),
                  title: const Text(
                    'Bài hát nổi bật',
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 20,
                    ),
                  ),
                ),
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
                ListTile(
                  onTap: () {
                    PersistentNavBarNavigator.pushNewScreen(
                      context,
                      screen: AlbumListScreen(
                        sort: 'createdAt_desc',
                        artistId: widget.artistId,
                      ),
                    );
                  },
                  iconColor: Colors.white,
                  textColor: Colors.white,
                  trailing: const Icon(Icons.arrow_forward_ios),
                  title: const Text(
                    'Album',
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 20,
                    ),
                  ),
                ),
                AlbumList(albums: state.artist!.albums ?? []),
              ],
            ),
          ),
          _buildArtistInfoFooter(state),
        ],
      ),
    );
  }

  Widget _buildArtistThumbnail(ArtistDetailState state) {
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

  Widget _buildArtistInfoFooter(ArtistDetailState state) {
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
