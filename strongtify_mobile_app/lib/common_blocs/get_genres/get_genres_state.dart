import 'package:strongtify_mobile_app/models/genre/genre.dart';

class GetGenresState {
  final List<Genre>? genres;
  final bool isLoading;

  GetGenresState({
    this.genres,
    this.isLoading = false,
  });
}
