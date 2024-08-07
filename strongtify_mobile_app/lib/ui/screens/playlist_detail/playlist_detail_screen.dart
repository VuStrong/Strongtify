import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:persistent_bottom_nav_bar_v2/persistent-tab-view.dart';
import 'package:share_plus/share_plus.dart';
import 'package:strongtify_mobile_app/common_blocs/auth/auth_bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/player/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/playlist_songs/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/user_favs/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist_detail.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/models/user/user.dart';
import 'package:strongtify_mobile_app/ui/screens/playlist_detail/add_songs_to_playlist_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/playlist_detail/bloc/bloc.dart';
import 'package:strongtify_mobile_app/ui/screens/playlist_detail/playlist_edit_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/profile/profile_screen.dart';
import 'package:strongtify_mobile_app/ui/widgets/playlist/small_playlist_item.dart';
import 'package:strongtify_mobile_app/ui/widgets/song/song_item.dart';
import 'package:strongtify_mobile_app/utils/bottom_sheet/song_menu_bottom_sheet.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';
import 'package:strongtify_mobile_app/utils/dialogs/prompt_dialog.dart';
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
  late final FToast fToast;
  late final String _currentUserId;

  @override
  void initState() {
    super.initState();

    fToast = FToast();
    fToast.init(context);

    _currentUserId = context.read<AuthBloc>().state.user!.id;
  }

  void _onTapRemoveSong(
    BuildContext context, {
    required String songId,
    required PlaylistSongsBloc bloc,
  }) {
    Navigator.pop(context);

    bloc.add(
      RemoveSongFromPlaylistEvent(
        playlistId: widget.playlistId,
        songId: songId,
      ),
    );
  }

  void _onTapSongMenu(
    BuildContext context, {
    required PlaylistDetail playlist,
    required Song song,
  }) {
    final playlistSongsBloc = context.read<PlaylistSongsBloc>();

    showSongMenuBottomSheet(
      context,
      song: song,
      anotherOptions: playlist.user.id == _currentUserId
          ? (context) => [
                ListTile(
                  leading: const Icon(Icons.remove_circle_outline),
                  textColor: Colors.white70,
                  iconColor: Colors.white70,
                  title: const Text('Xóa khỏi danh sách phát này'),
                  onTap: () {
                    _onTapRemoveSong(
                      context,
                      songId: song.id,
                      bloc: playlistSongsBloc,
                    );
                  },
                ),
              ]
          : null,
    );
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<PlaylistDetailBloc>(
          create: (context) => getIt<PlaylistDetailBloc>()
            ..add(GetPlaylistByIdEvent(id: widget.playlistId)),
        ),
        BlocProvider<PlaylistSongsBloc>(
          create: (context) => getIt<PlaylistSongsBloc>(),
        ),
      ],
      child: Scaffold(
        appBar: AppBar(
          foregroundColor: Colors.white,
          backgroundColor: ColorConstants.background,
          title: BlocBuilder<PlaylistDetailBloc, PlaylistDetailState>(
            builder: (context, PlaylistDetailState state) {
              return Text(
                state.status != PlaylistDetailStatus.loading
                    ? state.playlist?.name ?? ''
                    : '',
              );
            },
          ),
          actions: [
            BlocBuilder<PlaylistDetailBloc, PlaylistDetailState>(
              builder: (context, PlaylistDetailState state) {
                if (state.status == PlaylistDetailStatus.loading ||
                    state.playlist == null) {
                  return const SizedBox();
                }

                return IconButton(
                  icon: const Icon(Icons.more_vert_outlined),
                  onPressed: () {
                    _showPlaylistMenuBottomSheet(context, state.playlist!);
                  },
                );
              },
            ),
          ],
        ),
        body: MultiBlocListener(
          listeners: [
            BlocListener<PlaylistDetailBloc, PlaylistDetailState>(
              listener: (context, PlaylistDetailState state) {
                if (state.status == PlaylistDetailStatus.deleting) {
                  fToast.showLoadingToast(msg: 'Đang xóa playlist');
                } else if (state.status == PlaylistDetailStatus.deleted) {
                  Navigator.pop(context);

                  fToast.showSuccessToast(msg: 'Đã xóa playlist!');
                } else if (state.status == PlaylistDetailStatus.deleteFailed) {
                  fToast.showErrorToast(msg: state.errorMessage ?? '');
                }
              },
            ),
            BlocListener<PlaylistSongsBloc, PlaylistSongsState>(
              listener: (context, PlaylistSongsState state) {
                if (state.status == PlaylistSongsStatus.removing) {
                  fToast.showLoadingToast(msg: 'Đang xóa bài hát...');
                } else if (state.status == PlaylistSongsStatus.removed) {
                  context
                      .read<PlaylistDetailBloc>()
                      .add(RemoveSongFromPlaylistStateEvent(
                        songId: state.removedSongId ?? '',
                      ));

                  fToast.showSuccessToast(msg: 'Đã cập nhập playlist!');
                } else if (state.status == PlaylistSongsStatus.error) {
                  fToast.showErrorToast(msg: state.errorMessage ?? '');
                }
              },
            ),
          ],
          child: BlocBuilder<PlaylistDetailBloc, PlaylistDetailState>(
            builder: (context, PlaylistDetailState state) {
              if (state.status != PlaylistDetailStatus.loading) {
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
      ),
    );
  }

  Widget _buildPlaylistDetailScreen(
    BuildContext context,
    PlaylistDetailState state,
  ) {
    final bloc = context.read<PlaylistDetailBloc>();

    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Center(
              child: Container(
                width: MediaQuery.of(context).size.width * 0.5,
                height: MediaQuery.of(context).size.width * 0.5,
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
            _buildPlaylistActions(context, state),
            state.playlist!.description?.isNotEmpty ?? false
                ? Container(
                    padding: const EdgeInsets.only(bottom: 10),
                    width: double.infinity,
                    child: Text(
                      state.playlist!.description!,
                      style: const TextStyle(color: Colors.white54),
                    ),
                  )
                : const SizedBox(),
            const SizedBox(height: 10),
            state.playlist!.user.id == _currentUserId
                ? ListTile(
                    onTap: () {
                      pushNewScreen(
                        context,
                        screen: AddSongsToPlaylistScreen(
                          bloc: bloc,
                        ),
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
                      'Thêm bài hát',
                      style: TextStyle(color: Colors.white),
                    ),
                    contentPadding: const EdgeInsets.only(right: 0, left: 5),
                  )
                : const SizedBox(),
            _buildPlaylistSongs(context, state),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaylistUser(User user) {
    return GestureDetector(
      onTap: () {
        pushNewScreen(
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

  Widget _buildPlaylistActions(
    BuildContext context,
    PlaylistDetailState state,
  ) {
    return Row(
      children: [
        // Play button
        IconButton(
          onPressed: () {
            context.read<PlayerBloc>().add(CreatePlayerEvent(
                  songs: state.playlist!.songs ?? [],
                  playlistId: widget.playlistId,
                ));
          },
          iconSize: 50,
          icon: const Icon(
            Icons.play_circle,
            color: ColorConstants.primary,
          ),
        ),
        // Like button
        state.playlist!.user.id != _currentUserId
            ? BlocBuilder<UserFavsBloc, UserFavsState>(
                builder: (context, UserFavsState state) {
                  final liked =
                      state.data.likedPlaylistIds.contains(widget.playlistId);

                  return IconButton(
                    tooltip: liked ? 'Bỏ thích' : 'Thích',
                    onPressed: () {
                      if (liked) {
                        context.read<UserFavsBloc>().add(UnlikePlaylistEvent(
                              playlistId: widget.playlistId,
                            ));

                        fToast.showSuccessToast(
                            msg: 'Đã xóa khỏi mục yêu thích');
                      } else {
                        context.read<UserFavsBloc>().add(LikePlaylistEvent(
                              playlistId: widget.playlistId,
                            ));

                        fToast.showSuccessToast(
                            msg: 'Đã thêm vào mục yêu thích');
                      }
                    },
                    iconSize: 50,
                    icon: Icon(
                      liked ? Icons.favorite : Icons.favorite_border,
                      color: ColorConstants.primary,
                    ),
                  );
                },
              )
            : const SizedBox(),
      ],
    );
  }

  Widget _buildPlaylistSongs(
      BuildContext context, PlaylistDetailState playlistDetailState) {
    final songs = playlistDetailState.playlist!.songs!;

    if (songs.isEmpty) {
      return const Text(
        'Không có dữ liệu',
        style: TextStyle(color: Colors.white54),
      );
    }

    return BlocBuilder<PlayerBloc, PlayerState>(
      builder: (context, PlayerState state) {
        int index = -1;

        return ReorderableListView(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          buildDefaultDragHandles:
              playlistDetailState.playlist!.user.id == _currentUserId,
          children: songs.map((song) {
            index++;
            int currentIndex = index;

            return SongItem(
              key: Key(song.id),
              song: song,
              isPlaying: song.id == state.playingSong?.id,
              action: IconButton(
                icon: const Icon(
                  Icons.more_vert_outlined,
                  color: Colors.white,
                ),
                onPressed: () {
                  _onTapSongMenu(
                    context,
                    playlist: playlistDetailState.playlist!,
                    song: song,
                  );
                },
              ),
              onPressed: () {
                context.read<PlayerBloc>().add(CreatePlayerEvent(
                      songs: songs,
                      index: currentIndex,
                      playlistId: widget.playlistId,
                    ));
              },
            );
          }).toList(),
          onReorder: (int oldIndex, int newIndex) {
            if (oldIndex > newIndex) {
              newIndex++;
            }

            context
                .read<PlaylistDetailBloc>()
                .add(ChangeSongsOrderInPlaylistEvent(from: oldIndex + 1, to: newIndex));
          },
        );
      },
    );
  }

  void _showPlaylistMenuBottomSheet(
    BuildContext context,
    PlaylistDetail playlist,
  ) {
    final bloc = context.read<PlaylistDetailBloc>();
    final playlistContext = context;

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
              SmallPlaylistItem(playlist: playlist),
              const Divider(
                height: 1,
                thickness: 1,
                color: Colors.white30,
              ),
              ListTile(
                leading: const Icon(Icons.person_search),
                textColor: Colors.white70,
                iconColor: Colors.white70,
                title: const Text('Xem hồ sơ người dùng'),
                onTap: () async {
                  Navigator.pop(context);

                  pushNewScreen(
                    playlistContext,
                    screen: ProfileScreen(userId: playlist.user.id),
                  );
                },
              ),
              playlist.user.id == _currentUserId
                  ? ListTile(
                      leading: const Icon(Icons.add),
                      textColor: Colors.white70,
                      iconColor: Colors.white70,
                      title: const Text('Thêm bài hát'),
                      onTap: () async {
                        Navigator.pop(context);

                        pushNewScreen(
                          context,
                          screen: AddSongsToPlaylistScreen(
                            bloc: bloc,
                          ),
                          withNavBar: false,
                        );
                      },
                    )
                  : const SizedBox(),
              playlist.user.id == _currentUserId
                  ? ListTile(
                      leading: const Icon(Icons.edit),
                      textColor: Colors.white70,
                      iconColor: Colors.white70,
                      title: const Text('Chỉnh sửa danh sách phát'),
                      onTap: () async {
                        Navigator.pop(context);

                        pushNewScreen(
                          context,
                          screen: PlaylistEditScreen(
                            bloc: bloc,
                          ),
                          withNavBar: false,
                        );
                      },
                    )
                  : const SizedBox(),
              ListTile(
                leading: const Icon(Icons.share),
                textColor: Colors.white70,
                iconColor: Colors.white70,
                title: const Text('Chia sẻ'),
                onTap: () async {
                  Navigator.pop(context);

                  final domain = dotenv.env['WEB_CLIENT_URL'] ?? '';

                  Share.share('$domain/playlists/${playlist.id}');
                },
              ),
              playlist.user.id == _currentUserId
                  ? ListTile(
                      leading: const Icon(Icons.delete),
                      textColor: Colors.white70,
                      iconColor: Colors.white70,
                      title: const Text('Xóa danh sách phát'),
                      onTap: () async {
                        Navigator.pop(context);

                        final shouldDelete = await showPromptDialog(
                          context: context,
                          prompt: 'Bạn muốn xóa playlist này?',
                          title: playlist.name,
                        );

                        if (shouldDelete) {
                          bloc.add(DeletePlaylistEvent(
                            playlistId: playlist.id,
                          ));
                        }
                      },
                    )
                  : const SizedBox(),
            ],
          ),
        );
      },
    );
  }
}
