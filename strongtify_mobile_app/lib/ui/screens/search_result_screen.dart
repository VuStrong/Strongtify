import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
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

  @override
  void initState() {
    _searchController.text = widget.searchValue;

    BlocProvider.of<SearchBloc>(context)
        .add(SearchAllEvent(searchValue: widget.searchValue));

    super.initState();
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
                        isActive: state.searchType == 'all',
                        onClick: () {
                          if (state.searchType != 'all' &&
                              state is! SearchingState) {
                            context.read<SearchBloc>().add(SearchAllEvent(
                                  searchValue: _searchController.text,
                                ));
                          }
                        },
                      ),
                      ClickableItem(
                        title: 'Bài hát',
                        isActive: state.searchType == 'songs',
                        onClick: () {
                          if (state.searchType != 'songs' &&
                              state is! SearchingState) {
                            context.read<SearchBloc>().add(SearchSongsEvent(
                                  searchValue: _searchController.text,
                                ));
                          }
                        },
                      ),
                      ClickableItem(
                        title: 'Album',
                        isActive: state.searchType == 'albums',
                        onClick: () {
                          //
                        },
                      ),
                    ],
                  );
                },
              ),
            ),
            const SizedBox(height: 25),
            BlocBuilder<SearchBloc, SearchState>(
              builder: (context, SearchState state) {
                if (state is SearchingState) {
                  return const Center(
                    child: CircularProgressIndicator(
                      color: ColorConstants.primary,
                    ),
                  );
                }

                return _buildSearchResultScreen(state);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchResultScreen(SearchState state) {
    if (state is SearchedAllState) {
      return _buildSearchAllResult(state);
    } else if (state is SearchedSongsState) {
      return _buildSearchSongsResult(state);
    }

    return const Placeholder();
  }

  Widget _buildSearchAllResult(SearchedAllState state) {
    return Expanded(
      child: ListView(
        // shrinkWrap: true,
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
                SongList(songs: state.result.songs),
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
                AlbumList(albums: state.result.albums),
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
                PlaylistList(playlists: state.result.playlists),
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
                GenreGrid(genres: state.result.genres),
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
                ArtistList(artists: state.result.artists),
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
                UserGrid(users: state.result.users),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchSongsResult(SearchedSongsState state) {
    return const Placeholder();
  }
}
