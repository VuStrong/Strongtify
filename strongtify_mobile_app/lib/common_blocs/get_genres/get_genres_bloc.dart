import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/common_blocs/get_genres/bloc.dart';
import 'package:strongtify_mobile_app/models/genre/genre.dart';
import 'package:strongtify_mobile_app/services/api/genre_service.dart';

@injectable
class GetGenresBloc extends Bloc<GetGenresEvent, GetGenresState> {
  GetGenresBloc(this._genreService) : super(GetGenresState()) {
    on<GetAllGenresEvent>(_onGetAllGenres);
  }

  final GenreService _genreService;

  Future<void> _onGetAllGenres(GetAllGenresEvent event, Emitter<GetGenresState> emit) async {
    emit(GetGenresState(isLoading: true));

    List<Genre> genres = await _genreService.getAllGenres();

    emit(GetGenresState(genres: genres, isLoading: false));
  }
}