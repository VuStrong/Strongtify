import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/blocs/search/bloc.dart';
import 'package:strongtify_mobile_app/models/album/album.dart';
import 'package:strongtify_mobile_app/models/api_responses/paged_response.dart';
import 'package:strongtify_mobile_app/models/artist/artist.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist.dart';
import 'package:strongtify_mobile_app/models/search_model.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/models/user/user.dart';
import 'package:strongtify_mobile_app/services/api/search_service.dart';

@lazySingleton
class SearchBloc extends Bloc<SearchEvent, SearchState> {
  final SearchService _searchService;

  SearchBloc(this._searchService) : super(SearchState()) {
    on<SearchAllEvent>(_onSearchAll);

    on<SearchSongsEvent>(_onSearchSongs);
    on<SearchMoreSongsEvent>(_onSearchMoreSongs);

    on<SearchAlbumsEvent>(_onSearchAlbums);
    on<SearchMoreAlbumsEvent>(_onSearchMoreAlbums);

    on<SearchPlaylistsEvent>(_onSearchPlaylists);
    on<SearchMorePlaylistsEvent>(_onSearchMorePlaylists);

    on<SearchArtistsEvent>(_onSearchArtists);
    on<SearchMoreArtistsEvent>(_onSearchMoreArtists);

    on<SearchUsersEvent>(_onSearchUsers);
    on<SearchMoreUsersEvent>(_onSearchMoreUsers);
  }

  Future<void> _onSearchAll(
      SearchAllEvent event, Emitter<SearchState> emit) async {
    emit(SearchAllState(
      status: SearchStatus.loading,
    ));

    SearchModel result = await _searchService.searchAll(event.searchValue);

    emit(SearchAllState(
      status: SearchStatus.loaded,
      result: result,
    ));
  }

  Future<void> _onSearchSongs(
      SearchSongsEvent event, Emitter<SearchState> emit) async {
    emit(SearchSongsState(
      status: SearchStatus.loading,
    ));

    PagedResponse<Song> result = await _searchService.searchSongs(
      event.searchValue,
      skip: 0,
      take: 10,
    );

    emit(SearchSongsState(
      status: SearchStatus.loaded,
      songs: result.items,
      end: result.end,
    ));
  }

  Future<void> _onSearchMoreSongs(
      SearchMoreSongsEvent event, Emitter<SearchState> emit) async {
    final currentState = state as SearchSongsState;
    int currentSkip = currentState.skip;

    emit(SearchSongsState(
      status: SearchStatus.loadingMore,
      songs: currentState.songs,
    ));

    PagedResponse<Song> result = await _searchService.searchSongs(
      event.searchValue,
      skip: currentSkip + 10,
      take: 10,
    );

    currentState.songs?.addAll(result.items);

    emit(SearchSongsState(
      status: SearchStatus.loaded,
      songs: currentState.songs,
      end: result.end,
      skip: currentSkip + 10,
    ));
  }

  Future<void> _onSearchAlbums(
      SearchAlbumsEvent event, Emitter<SearchState> emit) async {
    emit(SearchAlbumsState(
      status: SearchStatus.loading,
    ));

    PagedResponse<Album> result = await _searchService.searchAlbums(
      event.searchValue,
      skip: 0,
      take: 10,
    );

    emit(SearchAlbumsState(
      status: SearchStatus.loaded,
      albums: result.items,
      end: result.end,
    ));
  }

  Future<void> _onSearchMoreAlbums(
      SearchMoreAlbumsEvent event, Emitter<SearchState> emit) async {
    final currentState = state as SearchAlbumsState;
    int currentSkip = currentState.skip;

    emit(SearchAlbumsState(
      status: SearchStatus.loadingMore,
      albums: currentState.albums,
    ));

    PagedResponse<Album> result = await _searchService.searchAlbums(
      event.searchValue,
      skip: currentSkip + 10,
      take: 10,
    );

    currentState.albums?.addAll(result.items);

    emit(SearchAlbumsState(
      status: SearchStatus.loaded,
      albums: currentState.albums,
      end: result.end,
      skip: currentSkip + 10,
    ));
  }

  Future<void> _onSearchPlaylists(
      SearchPlaylistsEvent event, Emitter<SearchState> emit) async {
    emit(SearchPlaylistsState(
      status: SearchStatus.loading,
    ));

    PagedResponse<Playlist> result = await _searchService.searchPlaylists(
      event.searchValue,
      skip: 0,
      take: 10,
    );

    emit(SearchPlaylistsState(
      status: SearchStatus.loaded,
      playlists: result.items,
      end: result.end,
    ));
  }

  Future<void> _onSearchMorePlaylists(
      SearchMorePlaylistsEvent event, Emitter<SearchState> emit) async {
    final currentState = state as SearchPlaylistsState;
    int currentSkip = currentState.skip;

    emit(SearchPlaylistsState(
      status: SearchStatus.loadingMore,
      playlists: currentState.playlists,
    ));

    PagedResponse<Playlist> result = await _searchService.searchPlaylists(
      event.searchValue,
      skip: currentSkip + 10,
      take: 10,
    );

    currentState.playlists?.addAll(result.items);

    emit(SearchPlaylistsState(
      status: SearchStatus.loaded,
      playlists: currentState.playlists,
      end: result.end,
      skip: currentSkip + 10,
    ));
  }

  Future<void> _onSearchArtists(
      SearchArtistsEvent event, Emitter<SearchState> emit) async {
    emit(SearchArtistsState(
      status: SearchStatus.loading,
    ));

    PagedResponse<Artist> result = await _searchService.searchArtists(
      event.searchValue,
      skip: 0,
      take: 10,
    );

    emit(SearchArtistsState(
      status: SearchStatus.loaded,
      artists: result.items,
      end: result.end,
    ));
  }

  Future<void> _onSearchMoreArtists(
      SearchMoreArtistsEvent event, Emitter<SearchState> emit) async {
    final currentState = state as SearchArtistsState;
    int currentSkip = currentState.skip;

    emit(SearchArtistsState(
      status: SearchStatus.loadingMore,
      artists: currentState.artists,
    ));

    PagedResponse<Artist> result = await _searchService.searchArtists(
      event.searchValue,
      skip: currentSkip + 10,
      take: 10,
    );

    currentState.artists?.addAll(result.items);

    emit(SearchArtistsState(
      status: SearchStatus.loaded,
      artists: currentState.artists,
      end: result.end,
      skip: currentSkip + 10,
    ));
  }

  Future<void> _onSearchUsers(
      SearchUsersEvent event, Emitter<SearchState> emit) async {
    emit(SearchUsersState(
      status: SearchStatus.loading,
    ));

    PagedResponse<User> result = await _searchService.searchUsers(
      event.searchValue,
      skip: 0,
      take: 10,
    );

    emit(SearchUsersState(
      status: SearchStatus.loaded,
      users: result.items,
      end: result.end,
    ));
  }

  Future<void> _onSearchMoreUsers(
      SearchMoreUsersEvent event, Emitter<SearchState> emit) async {
    final currentState = state as SearchUsersState;
    int currentSkip = currentState.skip;

    emit(SearchUsersState(
      status: SearchStatus.loadingMore,
      users: currentState.users,
    ));

    PagedResponse<User> result = await _searchService.searchUsers(
      event.searchValue,
      skip: currentSkip + 10,
      take: 10,
    );

    currentState.users?.addAll(result.items);

    emit(SearchUsersState(
      status: SearchStatus.loaded,
      users: currentState.users,
      end: result.end,
      skip: currentSkip + 10,
    ));
  }
}
