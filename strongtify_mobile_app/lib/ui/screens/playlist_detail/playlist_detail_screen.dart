import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:persistent_bottom_nav_bar/persistent_tab_view.dart';
import 'package:share_plus/share_plus.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/models/user/user.dart';
import 'package:strongtify_mobile_app/ui/screens/playlist_detail/bloc/bloc.dart';
import 'package:strongtify_mobile_app/ui/screens/profile/profile_screen.dart';
import 'package:strongtify_mobile_app/ui/widgets/song/song_list.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';
import 'package:strongtify_mobile_app/utils/enums.dart';
import 'package:strongtify_mobile_app/utils/extensions.dart';

class PlaylistDetailScreen extends StatefulWidget {
  const PlaylistDetailScreen({
    super.key,
    required this.playlistId,
  });

  final String playlistId;

  @override
  State<PlaylistDetailScreen> createState() => _PlaylistDetailScreenState();
}

class _PlaylistDetailScreenState extends State<PlaylistDetailScreen> {
  @override
  Widget build(BuildContext context) {
    return BlocProvider<PlaylistDetailBloc>(
      create: (context) => getIt<PlaylistDetailBloc>()
        ..add(GetPlaylistByIdEvent(id: widget.playlistId)),
      child: Scaffold(
        appBar: AppBar(
          foregroundColor: Colors.white,
          backgroundColor: ColorConstants.background,
          title: BlocBuilder<PlaylistDetailBloc, PlaylistDetailState>(
            builder: (context, PlaylistDetailState state) {
              return Text(
                !state.isLoading ? state.playlist?.name ?? '' : '',
              );
            },
          ),
          actions: [
            BlocBuilder<PlaylistDetailBloc, PlaylistDetailState>(
              builder: (context, PlaylistDetailState state) {
                if (state.isLoading || state.playlist == null) {
                  return const SizedBox();
                }

                return IconButton(
                  icon: const Icon(Icons.share),
                  tooltip: 'Chia sẻ',
                  onPressed: () {
                    final domain = dotenv.env['WEB_CLIENT_URL'] ?? '';
                    final playlist = state.playlist;

                    Share.share('$domain/playlists/${playlist!.id}');
                  },
                );
              },
            ),
          ],
        ),
        body: BlocBuilder<PlaylistDetailBloc, PlaylistDetailState>(
          builder: (context, PlaylistDetailState state) {
            if (!state.isLoading) {
              if (state.playlist == null) {
                return const Center(
                  child: Text(
                    'Không có dữ liệu',
                    style: TextStyle(color: Colors.white70),
                  ),
                );
              }

              return _buildPlaylistDetailScreen(context, state);
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

  Widget _buildPlaylistDetailScreen(
    BuildContext context,
    PlaylistDetailState state,
  ) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Center(
              child: Container(
                width: MediaQuery.of(context).size.width * 0.5,
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
                child: state.playlist!.imageUrl != null
                    ? Image.network(
                        state.playlist!.imageUrl!,
                        fit: BoxFit.cover,
                      )
                    : Image.asset('assets/img/default-song-img.png'),
              ),
            ),
            const SizedBox(height: 20),
            RichText(
              text: TextSpan(
                children: <TextSpan>[
                  const TextSpan(
                    text: 'Playlist',
                    style: TextStyle(color: Colors.white54),
                  ),
                  TextSpan(
                    text: state.playlist!.status == PlaylistStatus.private
                        ? ' (Riêng tư)'
                        : '',
                    style: const TextStyle(color: Colors.redAccent),
                  ),
                ],
              ),
            ),
            Text(
              state.playlist!.name,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 20,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            _buildPlaylistUser(state.playlist!.user),
            const SizedBox(height: 8),
            Text(
              '${state.playlist!.songCount} bài hát - ${state.playlist!.totalLength.toFormattedLength()}',
              style: const TextStyle(
                color: Colors.white70,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 5),
            Text(
              '${state.playlist!.likeCount} lượt thích',
              style: const TextStyle(
                color: Colors.white70,
              ),
            ),
            const SizedBox(height: 15),
            SizedBox(
              width: double.infinity,
              child: Text(
                state.playlist!.description ?? '',
                style: const TextStyle(color: Colors.white54),
              ),
            ),
            const SizedBox(height: 20),
            SongList(songs: state.playlist!.songs ?? []),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaylistUser(User user) {
    return GestureDetector(
      onTap: () {
        PersistentNavBarNavigator.pushNewScreen(
          context,
          screen: ProfileScreen(userId: user.id),
        );
      },
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(
            width: 24,
            height: 24,
            child: ClipOval(
              child: user.imageUrl != null
                  ? Image.network(
                      user.imageUrl!,
                      fit: BoxFit.cover,
                    )
                  : Image.asset('assets/img/default-avatar.png'),
            ),
          ),
          const SizedBox(width: 5),
          Text(
            user.name,
            style: const TextStyle(
              color: Colors.white54,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
