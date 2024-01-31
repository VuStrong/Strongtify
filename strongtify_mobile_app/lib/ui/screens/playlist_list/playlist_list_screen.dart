import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:strongtify_mobile_app/common_blocs/playlists/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/ui/widgets/playlist/playlist_list.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class PlaylistListScreen extends StatefulWidget {
  const PlaylistListScreen({
    super.key,
    this.title = 'Playlist',
    required this.event,
  });

  final String title;
  final PlaylistsEvent event;

  @override
  State<PlaylistListScreen> createState() => _PlaylistListScreenState();
}

class _PlaylistListScreenState extends State<PlaylistListScreen> {
   final RefreshController _refreshController = RefreshController(initialRefresh: false);

  @override
  Widget build(BuildContext context) {
    return BlocProvider<PlaylistsBloc>(
      create: (context) => getIt<PlaylistsBloc>()
        ..add(widget.event),
      child: Scaffold(
        appBar: AppBar(
          foregroundColor: Colors.white,
          backgroundColor: ColorConstants.background,
          title: Text(widget.title),
        ),
        body: BlocConsumer<PlaylistsBloc, PlaylistsState>(
          listener: (context, PlaylistsState state) {
            if (state is! LoadPlaylistsState ||
                state.status != LoadPlaylistsStatus.loaded) {
              return;
            }

            if (state.end) {
              _refreshController.loadNoData();
            } else {
              _refreshController.loadComplete();
            }
          },
          builder: (context, PlaylistsState state) {
            if (state is! LoadPlaylistsState ||
                state.status == LoadPlaylistsStatus.loading) {
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

  Widget _buildPlaylistList(BuildContext context, LoadPlaylistsState state) {
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
          context.read<PlaylistsBloc>().add(GetMorePlaylistsEvent());
        },
        child: PlaylistList(playlists: state.playlists ?? []),
      ),
    );
  }
}
