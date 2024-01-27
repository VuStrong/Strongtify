abstract class SearchEvent {
  final String searchValue;

  SearchEvent({required this.searchValue});
}

class SearchAllEvent extends SearchEvent {
  SearchAllEvent({required super.searchValue});
}

class SearchSongsEvent extends SearchEvent {
  SearchSongsEvent({required super.searchValue});
}

class SearchMoreSongsEvent extends SearchEvent {
  SearchMoreSongsEvent({required super.searchValue});
}

class SearchAlbumsEvent extends SearchEvent {
  SearchAlbumsEvent({required super.searchValue});
}

class SearchMoreAlbumsEvent extends SearchEvent {
  SearchMoreAlbumsEvent({required super.searchValue});
}

class SearchPlaylistsEvent extends SearchEvent {
  SearchPlaylistsEvent({required super.searchValue});
}

class SearchMorePlaylistsEvent extends SearchEvent {
  SearchMorePlaylistsEvent({required super.searchValue});
}

class SearchArtistsEvent extends SearchEvent {
  SearchArtistsEvent({required super.searchValue});
}

class SearchMoreArtistsEvent extends SearchEvent {
  SearchMoreArtistsEvent({required super.searchValue});
}

class SearchUsersEvent extends SearchEvent {
  SearchUsersEvent({required super.searchValue});
}

class SearchMoreUsersEvent extends SearchEvent {
  SearchMoreUsersEvent({required super.searchValue});
}
