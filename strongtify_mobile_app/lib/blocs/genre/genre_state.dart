import 'package:strongtify_mobile_app/models/genre/genre.dart';

abstract class GenreState {}

class LoadingGenreState extends GenreState {}

class LoadedAllGenresState extends GenreState {
  final List<Genre> genres;

  LoadedAllGenresState({
    required this.genres,
  });
}