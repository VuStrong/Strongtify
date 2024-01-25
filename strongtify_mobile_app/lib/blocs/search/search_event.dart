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