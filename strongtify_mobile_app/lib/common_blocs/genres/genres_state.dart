import 'package:strongtify_mobile_app/models/genre/genre.dart';

abstract class GenresState {}

class LoadGenresState extends GenresState {
  final List<Genre>? genres;
  final bool isLoading;

  LoadGenresState({
    this.genres,
    this.isLoading = false,
  });
}
