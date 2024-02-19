import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:strongtify_mobile_app/common_blocs/playlist_songs/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/ui/screens/playlist_detail/bloc/bloc.dart';
import 'package:strongtify_mobile_app/ui/screens/search/bloc/bloc.dart';
import 'package:strongtify_mobile_app/ui/widgets/song/song_item.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';
import 'package:strongtify_mobile_app/utils/extensions.dart';

class AddSongsToPlaylistScreen extends StatefulWidget {
  const AddSongsToPlaylistScreen({
    super.key,
    required this.bloc,
  });

  final PlaylistDetailBloc bloc;

  @override
  State<AddSongsToPlaylistScreen> createState() =>
      _AddSongsToPlaylistScreenState();
}

class _AddSongsToPlaylistScreenState extends State<AddSongsToPlaylistScreen> {
  late final FToast fToast;
  late final String playlistId;
  final TextEditingController _searchController = TextEditingController();
  final RefreshController _refreshController =
      RefreshController(initialRefresh: false);

  @override
  void initState() {
    playlistId = widget.bloc.state.playlist!.id;

    super.initState();

    fToast = FToast();
    fToast.init(context);
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<PlaylistDetailBloc>.value(
          value: widget.bloc,
        ),
        BlocProvider(
          create: (context) =>
              getIt<SearchBloc>()..add(SearchSongsEvent(searchValue: '')),
        ),
      ],
      child: Scaffold(
        appBar: AppBar(
          foregroundColor: Colors.white,
          title: const Text('Thêm bài hát'),
          backgroundColor: ColorConstants.background,
        ),
        body: BlocConsumer<SearchBloc, SearchState>(
          listener: (context, SearchState state) {
            if (state is! SearchSongsState ||
                state.status != SearchStatus.loaded) {
              return;
            }

            if (state.end) {
              _refreshController.loadNoData();
            } else {
              _refreshController.loadComplete();
            }
          },
          builder: (context, SearchState state) {
            return _buildScreen(context, state);
          },
        ),
      ),
    );
  }

  Widget _buildScreen(BuildContext context, SearchState state) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          SearchBar(
            padding: const MaterialStatePropertyAll<EdgeInsets>(
              EdgeInsets.symmetric(horizontal: 16.0),
            ),
            controller: _searchController,
            leading: const Icon(Icons.search),
            hintText: 'Tìm kiếm bài hát',
            onSubmitted: (String value) {
              context
                  .read<SearchBloc>()
                  .add(SearchSongsEvent(searchValue: value));
            },
          ),
          const SizedBox(height: 32),
          state.status == SearchStatus.loading
              ? const Center(
                  child: CircularProgressIndicator(
                    color: ColorConstants.primary,
                  ),
                )
              : _buildSearchedSongs(context, state as SearchSongsState),
        ],
      ),
    );
  }

  Widget _buildSearchedSongs(BuildContext context, SearchSongsState state) {
    return Expanded(
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
          context
              .read<SearchBloc>()
              .add(SearchMoreSongsEvent(searchValue: _searchController.text));
        },
        child: SingleChildScrollView(
          child: state.songs?.isEmpty ?? true
              ? const Text(
                  'Không có kết quả',
                  style: TextStyle(color: Colors.white54),
                )
              : Column(
                  children: state.songs!
                      .map((song) => SongItem(
                            song: song,
                            action: _AddSongToPlaylistButton(
                              playlistId: playlistId,
                              song: song,
                              onAdded: () {
                                widget.bloc.add(
                                  AddSongToPlaylistStateEvent(song: song),
                                );

                                fToast.showSuccessToast(
                                    msg: 'Đã thêm bài hát!');
                              },
                              onError: (String error) {
                                fToast.showErrorToast(msg: error);
                              },
                            ),
                          ))
                      .toList(),
                ),
        ),
      ),
    );
  }
}

class _AddSongToPlaylistButton extends StatelessWidget {
  final String playlistId;
  final Song song;
  final void Function()? onAdded;
  final void Function(String error)? onError;

  const _AddSongToPlaylistButton({
    required this.playlistId,
    required this.song,
    this.onAdded,
    this.onError,
  });

  @override
  Widget build(BuildContext context) {
    return BlocProvider<PlaylistSongsBloc>(
      create: (context) => getIt<PlaylistSongsBloc>(),
      child: BlocConsumer<PlaylistSongsBloc, PlaylistSongsState>(
        listener: (context, PlaylistSongsState state) {
          if (state.status == PlaylistSongsStatus.added) {
            if (onAdded != null) onAdded!();

            return;
          }

          if (state.status == PlaylistSongsStatus.error) {
            if (onError != null) onError!(state.errorMessage ?? '');
          }
        },
        builder: (context, PlaylistSongsState state) {
          return IconButton(
            icon: state.status == PlaylistSongsStatus.adding
                ? const SizedBox(
                    width: 15,
                    height: 15,
                    child: CircularProgressIndicator(
                      color: Colors.white,
                    ),
                  )
                : const Icon(
                    Icons.add_circle_outline_outlined,
                    color: Colors.white,
                  ),
            onPressed: () {
              if (state.status == PlaylistSongsStatus.adding) return;

              context.read<PlaylistSongsBloc>().add(
                    AddSongToPlaylistEvent(
                      playlistId: playlistId,
                      song: song,
                    ),
                  );
            },
          );
        },
      ),
    );
  }
}
