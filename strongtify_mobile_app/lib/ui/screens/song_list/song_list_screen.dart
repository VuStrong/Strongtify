import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:strongtify_mobile_app/common_blocs/get_songs/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/ui/widgets/song/song_list.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class SongListScreen extends StatefulWidget {
  const SongListScreen({
    super.key,
    this.title = 'Bài hát',
    required this.event,
  });

  final String title;
  final GetSongsEvent event;

  @override
  State<SongListScreen> createState() => _SongListScreenState();
}

class _SongListScreenState extends State<SongListScreen> {
  final RefreshController _refreshController =
      RefreshController(initialRefresh: false);

  @override
  Widget build(BuildContext context) {
    return BlocProvider<GetSongsBloc>(
      create: (context) => getIt<GetSongsBloc>()
        ..add(widget.event),
      child: Scaffold(
        appBar: AppBar(
          foregroundColor: Colors.white,
          backgroundColor: ColorConstants.background,
          title: Text(widget.title),
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
        child: SongList(songs: state.songs ?? []),
      ),
    );
  }
}
