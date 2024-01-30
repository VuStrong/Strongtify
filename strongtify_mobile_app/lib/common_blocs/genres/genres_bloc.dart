import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/common_blocs/genres/bloc.dart';
import 'package:strongtify_mobile_app/models/genre/genre.dart';
import 'package:strongtify_mobile_app/services/api/genre_service.dart';

@injectable
class GenresBloc extends Bloc<GenresEvent, GenresState> {
  GenresBloc(this._genreService) : super(LoadGenresState()) {
    on<GetAllGenresEvent>(_onGetAllGenres);
  }

  final GenreService _genreService;

  Future<void> _onGetAllGenres(GetAllGenresEvent event, Emitter<GenresState> emit) async {
    emit(LoadGenresState(isLoading: true));

    List<Genre> genres = await _genreService.getAllGenres();

    emit(LoadGenresState(genres: genres, isLoading: false));
  }
}