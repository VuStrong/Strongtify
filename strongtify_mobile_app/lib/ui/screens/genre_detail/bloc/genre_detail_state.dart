import 'package:strongtify_mobile_app/models/genre/genre_detail.dart';

class GenreDetailState {
  final GenreDetail? genre;
  final bool isLoading;

  GenreDetailState({
    this.genre,
    this.isLoading = false,
  });
}