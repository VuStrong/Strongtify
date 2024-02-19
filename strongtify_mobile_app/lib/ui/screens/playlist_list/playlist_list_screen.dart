import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:strongtify_mobile_app/common_blocs/get_playlists/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/ui/widgets/playlist/playlist_grid.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class PlaylistListScreen extends StatefulWidget {
  const PlaylistListScreen({
    super.key,
    this.title = 'Playlist',
    required this.event,
  });

  final String title;
  final GetPlaylistsEvent event;

  @override
  State<PlaylistListScreen> createState() => _PlaylistListScreenState();
}

class _PlaylistListScreenState extends State<PlaylistListScreen> {
   final RefreshController _refreshController = RefreshController(initialRefresh: false);

  @override
  Widget build(BuildContext context) {
    return BlocProvider<GetPlaylistsBloc>(
      create: (context) => getIt<GetPlaylistsBloc>()
        ..add(widget.event),
      child: Scaffold(
        appBar: AppBar(
          foregroundColor: Colors.white,
          backgroundColor: ColorConstants.background,
          title: Text(widget.title),
        ),
        body: BlocConsumer<GetPlaylistsBloc, GetPlaylistsState>(
          listener: (context, GetPlaylistsState state) {
            if (state.status != LoadPlaylistsStatus.loaded) {
              return;
            }

            if (state.end) {
              _refreshController.loadNoData();
            } else {
              _refreshController.loadComplete();
            }
          },
          builder: (context, GetPlaylistsState state) {
            if (state.status == LoadPlaylistsStatus.loading) {
              return const Center(
                child: CircularProgressIndicator(
                  color: ColorConstants.primary,
                ),
              );
            }

            return _buildPlaylistList(context, state);
          },
        ),
      ),
    );
  }

  Widget _buildPlaylistList(BuildContext context, GetPlaylistsState state) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: SmartRefresher(
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
          context.read<GetPlaylistsBloc>().add(GetMorePlaylistsEvent());
        },
        child: PlaylistGrid(playlists: state.playlists ?? []),
      ),
    );
  }
}
