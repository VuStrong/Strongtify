import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:strongtify_mobile_app/common_blocs/get_songs/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/player/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/ui/widgets/song/song_item.dart';
import 'package:strongtify_mobile_app/utils/bottom_sheet/song_menu_bottom_sheet.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class SongListenHistoryScreen extends StatefulWidget {
  const SongListenHistoryScreen({
    super.key,
  });

  @override
  State<SongListenHistoryScreen> createState() =>
      _SongListenHistoryScreenState();
}

class _SongListenHistoryScreenState extends State<SongListenHistoryScreen> {
  final RefreshController _refreshController =
      RefreshController(initialRefresh: false);

  @override
  Widget build(BuildContext context) {
    return BlocProvider<GetSongsBloc>(
      create: (context) =>
          getIt<GetSongsBloc>()..add(GetCurrentUserListenHistoryEvent()),
      child: Scaffold(
        appBar: AppBar(
          foregroundColor: Colors.white,
          backgroundColor: ColorConstants.background,
          title: const Text("Nghe gần đây"),
        ),
        body: BlocConsumer<GetSongsBloc, GetSongsState>(
          listener: (context, GetSongsState state) {
            if (state.status != LoadSongsStatus.loaded) {
              return;
            }

            if (state.end) {
              _refreshController.loadNoData();
            } else {
              _refreshController.loadComplete();
            }
          },
          builder: (context, GetSongsState state) {
            if (state.status == LoadSongsStatus.loading) {
              return const Center(
                child: CircularProgressIndicator(
                  color: ColorConstants.primary,
                ),
              );
            }

            if (state.songs == null || state.songs!.isEmpty) {
              return const Text(
                'Không có dữ liệu',
                style: TextStyle(color: Colors.white54),
              );
            }

            return _buildSongList(context, state);
          },
        ),
      ),
    );
  }

  Widget _buildSongList(BuildContext context, GetSongsState state) {
    return SmartRefresher(
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
        context.read<GetSongsBloc>().add(GetMoreSongsEvent());
      },
      child: SingleChildScrollView(
        padding: const EdgeInsets.only(right: 20, left: 20),
        child: BlocBuilder<PlayerBloc, PlayerState>(
          builder: (context, PlayerState playerState) {
            int index = -1;

            return Column(
              children: state.songs!.map((song) {
                index++;

                int currentIndex = index;

                return SongItem(
                  song: song,
                  isPlaying: song.id == playerState.playingSong?.id,
                  action: IconButton(
                    icon: const Icon(
                      Icons.more_vert_outlined,
                      color: Colors.white,
                    ),
                    onPressed: () {
                      showSongMenuBottomSheet(context,
                          song: song,
                          anotherOptions: (sheetContext) => [
                                ListTile(
                                  leading: const Icon(Icons.history_outlined),
                                  textColor: Colors.white70,
                                  iconColor: Colors.white70,
                                  title: const Text(
                                      'Xóa khỏi danh sách nghe gần đây'),
                                  onTap: () {
                                    Navigator.pop(sheetContext);

                                    context
                                        .read<GetSongsBloc>()
                                        .add(RemoveSongFromListenHistoryEvent(
                                          songId: song.id,
                                        ));
                                  },
                                ),
                              ]);
                    },
                  ),
                  onPressed: () {
                    context.read<PlayerBloc>().add(CreatePlayerEvent(
                          songs: state.songs ?? [],
                          index: currentIndex,
                        ));
                  },
                );
              }).toList(),
            );
          },
        ),
      ),
    );
  }
}
