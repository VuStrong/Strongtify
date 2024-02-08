import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:strongtify_mobile_app/common_blocs/get_albums/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/ui/widgets/album/album_list.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class AlbumListScreen extends StatefulWidget {
  const AlbumListScreen({
    super.key,
    this.title = 'Album',
    required this.event,
  });

  final String title;
  final GetAlbumsEvent event;

  @override
  State<AlbumListScreen> createState() => _AlbumListScreenState();
}

class _AlbumListScreenState extends State<AlbumListScreen> {
  final RefreshController _refreshController =
      RefreshController(initialRefresh: false);

  @override
  Widget build(BuildContext context) {
    return BlocProvider<GetAlbumsBloc>(
      create: (context) => getIt<GetAlbumsBloc>()
        ..add(widget.event),
      child: Scaffold(
        appBar: AppBar(
          foregroundColor: Colors.white,
          backgroundColor: ColorConstants.background,
          title: Text(widget.title),
        ),
        body: BlocConsumer<GetAlbumsBloc, GetAlbumsState>(
          listener: (context, GetAlbumsState state) {
            if (state.status != LoadAlbumsStatus.loaded) {
              return;
            }

            if (state.end) {
              _refreshController.loadNoData();
            } else {
              _refreshController.loadComplete();
            }
          },
          builder: (context, GetAlbumsState state) {
            if (state.status == LoadAlbumsStatus.loading) {
              return const Center(
                child: CircularProgressIndicator(
                  color: ColorConstants.primary,
                ),
              );
            }

            return _buildAlbumList(context, state);
          },
        ),
      ),
    );
  }

  Widget _buildAlbumList(BuildContext context, GetAlbumsState state) {
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
          context.read<GetAlbumsBloc>().add(GetMoreAlbumsEvent());
        },
        child: AlbumList(albums: state.albums ?? []),
      ),
    );
  }
}
