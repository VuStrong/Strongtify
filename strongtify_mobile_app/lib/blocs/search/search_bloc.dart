import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/blocs/search/bloc.dart';
import 'package:strongtify_mobile_app/models/api_responses/paged_response.dart';
import 'package:strongtify_mobile_app/models/search_model.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/services/api/search_service.dart';

@lazySingleton
class SearchBloc extends Bloc<SearchEvent, SearchState> {
  final SearchService _searchService;
  
  SearchBloc(this._searchService) : super(SearchingState(searchType: 'all')) {
    on<SearchAllEvent>(_onSearchAll);
    on<SearchSongsEvent>(_onSearchSongs);
  }
  
  Future<void> _onSearchAll(SearchAllEvent event, Emitter<SearchState> emit) async {
    emit(SearchingState(searchType: 'all'));
    
    SearchModel result = await _searchService.searchAll(event.searchValue);
    
    emit(SearchedAllState(result: result));
  }

  Future<void> _onSearchSongs(SearchSongsEvent event, Emitter<SearchState> emit) async {
    emit(SearchingState(searchType: 'songs'));

    PagedResponse<Song> result = await _searchService.searchSongs(event.searchValue);

    emit(SearchedSongsState(result: result));
  }
}