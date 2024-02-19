import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:strongtify_mobile_app/common_blocs/get_artists/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/ui/widgets/artist/artist_grid.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class ArtistListScreen extends StatefulWidget {
  const ArtistListScreen({
    super.key,
    this.title = 'Nghệ sĩ',
    required this.event,
  });

  final String title;
  final GetArtistsEvent event;

  @override
  State<ArtistListScreen> createState() => _ArtistListScreenState();
}

class _ArtistListScreenState extends State<ArtistListScreen> {
  final RefreshController _refreshController =
      RefreshController(initialRefresh: false);

  @override
  Widget build(BuildContext context) {
    return BlocProvider<GetArtistsBloc>(
      create: (context) => getIt<GetArtistsBloc>()..add(widget.event),
      child: Scaffold(
        appBar: AppBar(
          foregroundColor: Colors.white,
          backgroundColor: ColorConstants.background,
          title: Text(widget.title),
        ),
        body: BlocConsumer<GetArtistsBloc, GetArtistsState>(
          listener: (context, GetArtistsState state) {
            if (state.status != LoadArtistsStatus.loaded) {
              return;
            }

            if (state.end) {
              _refreshController.loadNoData();
            } else {
              _refreshController.loadComplete();
            }
          },
          builder: (context, GetArtistsState state) {
            if (state.status == LoadArtistsStatus.loading) {
              return const Center(
                child: CircularProgressIndicator(
                  color: ColorConstants.primary,
                ),
              );
            }

            return _buildArtistList(context, state);
          },
        ),
      ),
    );
  }

  Widget _buildArtistList(BuildContext context, GetArtistsState state) {
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
          context.read<GetArtistsBloc>().add(GetMoreArtistsEvent());
        },
        child: ArtistGrid(artists: state.artists ?? []),
      ),
    );
  }
}
