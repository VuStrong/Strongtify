import 'package:strongtify_mobile_app/models/api_responses/paged_response.dart';
import 'package:strongtify_mobile_app/models/search_model.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';

abstract class SearchState {
  final String searchType;

  SearchState({
    this.searchType = 'all',
  });
}

class SearchingState extends SearchState {
  SearchingState({super.searchType});
}

class SearchedAllState extends SearchState {
  final SearchModel result;

  SearchedAllState({
    required this.result,
  }) : super(searchType: 'all');
}

class SearchedSongsState extends SearchState {
  final PagedResponse<Song> result;

  SearchedSongsState({
    required this.result,
  }) : super(searchType: 'songs');
}
