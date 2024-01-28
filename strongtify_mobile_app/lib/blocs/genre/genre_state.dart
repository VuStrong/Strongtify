import 'package:strongtify_mobile_app/models/genre/genre.dart';
import 'package:strongtify_mobile_app/models/genre/genre_detail.dart';

abstract class GenreState {}

class LoadingGenreState extends GenreState {}

class LoadedAllGenresState extends GenreState {
  final List<Genre> genres;

  LoadedAllGenresState({
    required this.genres,
  });
}

class LoadedGenreByIdState extends GenreState {
  final GenreDetail? genre;

  LoadedGenreByIdState({
    this.genre,
  });
}
