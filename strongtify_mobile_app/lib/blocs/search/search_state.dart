import 'package:strongtify_mobile_app/models/album/album.dart';
import 'package:strongtify_mobile_app/models/artist/artist.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist.dart';
import 'package:strongtify_mobile_app/models/search_model.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/models/user/user.dart';

enum SearchStatus {
  loaded,
  loading,
  loadingMore,
}

enum SearchType { all, songs, albums, playlists, artists, genres, users }

abstract class SearchWithPagination {
  final int skip = 0;
  final bool end = false;
}

class SearchState {
  final SearchType searchType;
  final SearchStatus status;

  SearchState({
    this.searchType = SearchType.all,
    this.status = SearchStatus.loading,
  });
}

class SearchAllState extends SearchState {
  final SearchModel? result;

  SearchAllState({
    this.result,
    super.status,
  }) : super(searchType: SearchType.all);
}

class SearchSongsState extends SearchState implements SearchWithPagination {
  final List<Song>? songs;

  @override
  final int skip;

  @override
  final bool end;

  SearchSongsState({
    this.songs,
    this.skip = 0,
    this.end = false,
    super.status,
  }) : super(searchType: SearchType.songs);
}

class SearchAlbumsState extends SearchState implements SearchWithPagination {
  final List<Album>? albums;

  @override
  final int skip;

  @override
  final bool end;

  SearchAlbumsState({
    this.albums,
    this.skip = 0,
    this.end = false,
    super.status,
  }) : super(searchType: SearchType.albums);
}

class SearchPlaylistsState extends SearchState implements SearchWithPagination {
  final List<Playlist>? playlists;

  @override
  final int skip;

  @override
  final bool end;

  SearchPlaylistsState({
    this.playlists,
    this.skip = 0,
    this.end = false,
    super.status,
  }) : super(searchType: SearchType.playlists);
}

class SearchArtistsState extends SearchState implements SearchWithPagination {
  final List<Artist>? artists;

  @override
  final int skip;

  @override
  final bool end;

  SearchArtistsState({
    this.artists,
    this.skip = 0,
    this.end = false,
    super.status,
  }) : super(searchType: SearchType.artists);
}

class SearchUsersState extends SearchState implements SearchWithPagination {
  final List<User>? users;

  @override
  final int skip;

  @override
  final bool end;

  SearchUsersState({
    this.users,
    this.skip = 0,
    this.end = false,
    super.status,
  }) : super(searchType: SearchType.users);
}