import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:strongtify_mobile_app/common_blocs/songs/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/ui/widgets/song/song_list.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class SongListScreen extends StatefulWidget {
  const SongListScreen({
    super.key,
    this.title = 'Bài hát',
    this.artistId,
    this.genreId,
    this.sort,
  });

  final String title;
  final String? artistId;
  final String? genreId;
  final String? sort;

  @override
  State<SongListScreen> createState() => _SongListScreenState();
}

class _SongListScreenState extends State<SongListScreen> {
  final RefreshController _refreshController =
      RefreshController(initialRefresh: false);

  @override
  Widget build(BuildContext context) {
    return BlocProvider<SongsBloc>(
      create: (context) => getIt<SongsBloc>()
        ..add(GetSongsEvent(
          genreId: widget.genreId,
          artistId: widget.artistId,
          sort: widget.sort,
        )),
      child: Scaffold(
        appBar: AppBar(
          foregroundColor: Colors.white,
          backgroundColor: ColorConstants.background,
          title: Text(widget.title),
        ),
        body: BlocConsumer<SongsBloc, SongsState>(
          listener: (context, SongsState state) {
            if (state is! LoadSongsState ||
                state.status != LoadSongsStatus.loaded) {
              return;
            }

            if (state.end) {
              _refreshController.loadNoData();
            } else {
              _refreshController.loadComplete();
            }
          },
          builder: (context, SongsState state) {
            if (state is! LoadSongsState ||
                state.status == LoadSongsStatus.loading) {
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

  Widget _buildSongList(BuildContext context, LoadSongsState state) {
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
        context.read<SongsBloc>().add(GetMoreSongsEvent());
      },
      child: SingleChildScrollView(
        child: SongList(songs: state.songs ?? []),
      ),
    );
  }
}
