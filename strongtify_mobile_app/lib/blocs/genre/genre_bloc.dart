import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/blocs/genre/bloc.dart';
import 'package:strongtify_mobile_app/models/genre/genre.dart';
import 'package:strongtify_mobile_app/models/genre/genre_detail.dart';
import 'package:strongtify_mobile_app/services/api/genre_service.dart';

@injectable
class GenreBloc extends Bloc<GenreEvent, GenreState> {
  GenreBloc(this._genreService) : super(LoadingGenreState()) {
    on<GetAllGenresEvent>(_onGetAllGenres);
    on<GetGenreByIdEvent>(_onGetGenreById);
  }

  final GenreService _genreService;

  Future<void> _onGetAllGenres(GetAllGenresEvent event, Emitter<GenreState> emit) async {
    emit(LoadingGenreState());

    List<Genre> genres = await _genreService.getAllGenres();

    emit(LoadedAllGenresState(genres: genres));
  }

  Future<void> _onGetGenreById(GetGenreByIdEvent event, Emitter<GenreState> emit) async {
    emit(LoadingGenreState());

    GenreDetail? genre = await _genreService.getGenreById(event.id);

    emit(LoadedGenreByIdState(genre: genre));
  }
}