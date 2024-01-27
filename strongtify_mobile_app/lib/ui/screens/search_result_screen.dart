import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:strongtify_mobile_app/blocs/search/bloc.dart';
import 'package:strongtify_mobile_app/ui/widgets/album/album_list.dart';
import 'package:strongtify_mobile_app/ui/widgets/artist/artist_list.dart';
import 'package:strongtify_mobile_app/ui/widgets/clickable_item.dart';
import 'package:strongtify_mobile_app/ui/widgets/genre/genre_grid.dart';
import 'package:strongtify_mobile_app/ui/widgets/playlist/playlist_list.dart';
import 'package:strongtify_mobile_app/ui/widgets/song/song_list.dart';
import 'package:strongtify_mobile_app/ui/widgets/user/user_grid.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class SearchResultScreen extends StatefulWidget {
  const SearchResultScreen({
    super.key,
    required this.searchValue,
  });

  final String searchValue;

  @override
  State<SearchResultScreen> createState() => _SearchResultScreenState();
}

class _SearchResultScreenState extends State<SearchResultScreen> {
  final TextEditingController _searchController = TextEditingController();
  RefreshController? _refreshController;

  @override
  void initState() {
    _searchController.text = widget.searchValue;

    BlocProvider.of<SearchBloc>(context)
        .add(SearchAllEvent(searchValue: widget.searchValue));

    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        foregroundColor: Colors.white,
        backgroundColor: Colors.grey.shade900,
        title: TextField(
          controller: _searchController,
          style: const TextStyle(color: Colors.white),
          cursorColor: Colors.white,
          decoration: const InputDecoration(
            hintText: 'Bạn muốn nghe gì?',
            hintStyle: TextStyle(color: Colors.white54),
            border: InputBorder.none,
          ),
          onSubmitted: (value) {
            if (value.isNotEmpty) {
              context
                  .read<SearchBloc>()
                  .add(SearchAllEvent(searchValue: _searchController.text));
            }
          },
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              height: 50,
              child: BlocBuilder<SearchBloc, SearchState>(
                builder: (context, SearchState state) {
                  return ListView(
                    scrollDirection: Axis.horizontal,
                    shrinkWrap: true,
                    children: [
                      ClickableItem(
                        title: 'Tất cả',
                        isActive: state.searchType == SearchType.all,
                        onClick: () {
                          if (state.searchType != SearchType.all &&
                              state.status != SearchStatus.loading) {
                            context.read<SearchBloc>().add(SearchAllEvent(
                                  searchValue: _searchController.text,
                                ));
                          }
                        },
                      ),
                      ClickableItem(
                        title: 'Bài hát',
                        isActive: state.searchType == SearchType.songs,
                        onClick: () {
                          if (state.searchType != SearchType.songs &&
                              state.status != SearchStatus.loading) {
                            context.read<SearchBloc>().add(SearchSongsEvent(
                                  searchValue: _searchController.text,
                                ));

                            _refreshController =
                                RefreshController(initialRefresh: false);
                          }
                        },
                      ),
                      ClickableItem(
                        title: 'Album',
                        isActive: state.searchType == SearchType.albums,
                        onClick: () {
                          if (state.searchType != SearchType.albums &&
                              state.status != SearchStatus.loading) {
                            context.read<SearchBloc>().add(SearchAlbumsEvent(
                                  searchValue: _searchController.text,
                                ));

                            _refreshController =
                                RefreshController(initialRefresh: false);
                          }
                        },
                      ),
                      ClickableItem(
                        title: 'Playlist',
                        isActive: state.searchType == SearchType.playlists,
                        onClick: () {
                          if (state.searchType != SearchType.playlists &&
                              state.status != SearchStatus.loading) {
                            context.read<SearchBloc>().add(SearchPlaylistsEvent(
                                  searchValue: _searchController.text,
                                ));

                            _refreshController =
                                RefreshController(initialRefresh: false);
                          }
                        },
                      ),
                      ClickableItem(
                        title: 'Nghệ sĩ',
                        isActive: state.searchType == SearchType.artists,
                        onClick: () {
                          if (state.searchType != SearchType.artists &&
                              state.status != SearchStatus.loading) {
                            context.read<SearchBloc>().add(SearchArtistsEvent(
                                  searchValue: _searchController.text,
                                ));

                            _refreshController =
                                RefreshController(initialRefresh: false);
                          }
                        },
                      ),
                      ClickableItem(
                        title: 'User',
                        isActive: state.searchType == SearchType.users,
                        onClick: () {
                          if (state.searchType != SearchType.users &&
                              state.status != SearchStatus.loading) {
                            context.read<SearchBloc>().add(SearchUsersEvent(
                                  searchValue: _searchController.text,
                                ));

                            _refreshController =
                                RefreshController(initialRefresh: false);
                          }
                        },
                      ),
                    ],
                  );
                },
              ),
            ),
            const SizedBox(height: 25),
            BlocConsumer<SearchBloc, SearchState>(
              listener: (context, SearchState state) {
                if (state.status != SearchStatus.loaded ||
                    state is SearchAllState) return;

                if (state is SearchWithPagination) {
                  bool end = (state as SearchWithPagination).end;

                  if (end == true) {
                    _refreshController?.loadNoData();
                  } else {
                    _refreshController?.loadComplete();
                  }
                }
              },
              builder: (context, SearchState state) {
                if (state.status == SearchStatus.loading) {
                  return const Center(
                    child: CircularProgressIndicator(
                      color: ColorConstants.primary,
                    ),
                  );
                }

                return _buildSearchResultScreen(context, state);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchResultScreen(BuildContext context, SearchState state) {
    if (state is SearchAllState) {
      return _buildSearchAllResult(state);
    } else if (state is SearchSongsState) {
      return _buildSearchSongsResult(context, state);
    } else if (state is SearchAlbumsState) {
      return _buildSearchAlbumsResult(context, state);
    } else if (state is SearchPlaylistsState) {
      return _buildSearchPlaylistsResult(context, state);
    } else if (state is SearchArtistsState) {
      return _buildSearchArtistsResult(context, state);
    } else if (state is SearchUsersState) {
      return _buildSearchUsersResult(context, state);
    }

    return const Placeholder();
  }

  Widget _buildSearchAllResult(SearchAllState state) {
    return Expanded(
      child: ListView(
        children: [
          Padding(
            padding: const EdgeInsets.only(bottom: 20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Bài hát',
                  textAlign: TextAlign.start,
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 20,
                  ),
                ),
                const SizedBox(height: 16),
                SongList(songs: state.result?.songs ?? []),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 20, bottom: 20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Albums',
                  textAlign: TextAlign.start,
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 20,
                  ),
                ),
                const SizedBox(height: 16),
                AlbumList(albums: state.result?.albums ?? []),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 20, bottom: 20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Playlists',
                  textAlign: TextAlign.start,
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 20,
                  ),
                ),
                const SizedBox(height: 16),
                PlaylistList(playlists: state.result?.playlists ?? []),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 20, bottom: 20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Thể loại',
                  textAlign: TextAlign.start,
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 20,
                  ),
                ),
                const SizedBox(height: 16),
                GenreGrid(genres: state.result?.genres ?? []),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 20, bottom: 20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Nghệ sĩ',
                  textAlign: TextAlign.start,
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 20,
                  ),
                ),
                const SizedBox(height: 16),
                ArtistList(artists: state.result?.artists ?? []),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 20, bottom: 20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'User',
                  textAlign: TextAlign.start,
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 20,
                  ),
                ),
                const SizedBox(height: 16),
                UserGrid(users: state.result?.users ?? []),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchSongsResult(BuildContext context, SearchSongsState state) {
    return Expanded(
      child: SmartRefresher(
        enablePullUp: true,
        enablePullDown: false,
        footer: CustomFooter(
          builder: (BuildContext context, LoadStatus? mode) {
            late final Widget body;

            if (mode == LoadStatus.loading) {
              body = const CircularProgressIndicator();
            } else {
              body = const SizedBox.shrink();
            }

            return SizedBox(
              height: 55,
              child: Center(child: body),
            );
          },
        ),
        controller:
            _refreshController ?? RefreshController(initialRefresh: false),
        onLoading: () {
          context
              .read<SearchBloc>()
              .add(SearchMoreSongsEvent(searchValue: _searchController.text));
        },
        child: SingleChildScrollView(
          child: SongList(songs: state.songs ?? []),
        ),
      ),
    );
  }

  Widget _buildSearchAlbumsResult(
      BuildContext context, SearchAlbumsState state) {
    return Expanded(
      child: SmartRefresher(
        enablePullUp: true,
        enablePullDown: false,
        footer: CustomFooter(
          builder: (BuildContext context, LoadStatus? mode) {
            late final Widget body;

            if (mode == LoadStatus.loading) {
              body = const CircularProgressIndicator();
            } else {
              body = const SizedBox.shrink();
            }

            return SizedBox(
              height: 55,
              child: Center(child: body),
            );
          },
        ),
        controller:
            _refreshController ?? RefreshController(initialRefresh: false),
        onLoading: () {
          context
              .read<SearchBloc>()
              .add(SearchMoreAlbumsEvent(searchValue: _searchController.text));
        },
        child: SingleChildScrollView(
          child: AlbumList(albums: state.albums ?? []),
        ),
      ),
    );
  }

  Widget _buildSearchPlaylistsResult(
      BuildContext context, SearchPlaylistsState state) {
    return Expanded(
      child: SmartRefresher(
        enablePullUp: true,
        enablePullDown: false,
        footer: CustomFooter(
          builder: (BuildContext context, LoadStatus? mode) {
            late final Widget body;

            if (mode == LoadStatus.loading) {
              body = const CircularProgressIndicator();
            } else {
              body = const SizedBox.shrink();
            }

            return SizedBox(
              height: 55,
              child: Center(child: body),
            );
          },
        ),
        controller:
            _refreshController ?? RefreshController(initialRefresh: false),
        onLoading: () {
          context.read<SearchBloc>().add(
              SearchMorePlaylistsEvent(searchValue: _searchController.text));
        },
        child: SingleChildScrollView(
          child: PlaylistList(playlists: state.playlists ?? []),
        ),
      ),
    );
  }

  Widget _buildSearchArtistsResult(
      BuildContext context, SearchArtistsState state) {
    return Expanded(
      child: SmartRefresher(
        enablePullUp: true,
        enablePullDown: false,
        footer: CustomFooter(
          builder: (BuildContext context, LoadStatus? mode) {
            late final Widget body;

            if (mode == LoadStatus.loading) {
              body = const CircularProgressIndicator();
            } else {
              body = const SizedBox.shrink();
            }

            return SizedBox(
              height: 55,
              child: Center(child: body),
            );
          },
        ),
        controller:
            _refreshController ?? RefreshController(initialRefresh: false),
        onLoading: () {
          context
              .read<SearchBloc>()
              .add(SearchMoreArtistsEvent(searchValue: _searchController.text));
        },
        child: SingleChildScrollView(
          child: ArtistList(artists: state.artists ?? []),
        ),
      ),
    );
  }

  Widget _buildSearchUsersResult(BuildContext context, SearchUsersState state) {
    return Expanded(
      child: SmartRefresher(
        enablePullUp: true,
        enablePullDown: false,
        footer: CustomFooter(
          builder: (BuildContext context, LoadStatus? mode) {
            late final Widget body;

            if (mode == LoadStatus.loading) {
              body = const CircularProgressIndicator();
            } else {
              body = const SizedBox.shrink();
            }

            return SizedBox(
              height: 55,
              child: Center(child: body),
            );
          },
        ),
        controller:
            _refreshController ?? RefreshController(initialRefresh: false),
        onLoading: () {
          context
              .read<SearchBloc>()
              .add(SearchMoreUsersEvent(searchValue: _searchController.text));
        },
        child: SingleChildScrollView(
          child: UserGrid(users: state.users ?? []),
        ),
      ),
    );
  }
}
