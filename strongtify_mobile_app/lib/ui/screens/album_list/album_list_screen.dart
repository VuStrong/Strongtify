import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:strongtify_mobile_app/common_blocs/albums/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/ui/widgets/album/album_list.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class AlbumListScreen extends StatefulWidget {
  const AlbumListScreen({
    super.key,
    this.title = 'Album',
    this.artistId,
    this.genreId,
    this.sort,
  });

  final String title;
  final String? artistId;
  final String? genreId;
  final String? sort;

  @override
  State<AlbumListScreen> createState() => _AlbumListScreenState();
}

class _AlbumListScreenState extends State<AlbumListScreen> {
  final RefreshController _refreshController =
      RefreshController(initialRefresh: false);

  @override
  Widget build(BuildContext context) {
    return BlocProvider<AlbumsBloc>(
      create: (context) => getIt<AlbumsBloc>()
        ..add(GetAlbumsEvent(
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
        body: BlocConsumer<AlbumsBloc, AlbumsState>(
          listener: (context, AlbumsState state) {
            if (state is! LoadAlbumsState ||
                state.status != LoadAlbumsStatus.loaded) {
              return;
            }

            if (state.end) {
              _refreshController.loadNoData();
            } else {
              _refreshController.loadComplete();
            }
          },
          builder: (context, AlbumsState state) {
            if (state is! LoadAlbumsState ||
                state.status == LoadAlbumsStatus.loading) {
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

  Widget _buildAlbumList(BuildContext context, LoadAlbumsState state) {
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
        context.read<AlbumsBloc>().add(GetMoreAlbumsEvent());
      },
      child: AlbumList(albums: state.albums ?? []),
    );
  }
}
