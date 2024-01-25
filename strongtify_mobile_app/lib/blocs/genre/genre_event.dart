abstract class GenreEvent {}

class GetAllGenresEvent extends GenreEvent {}

class GetGenreByIdEvent extends GenreEvent {
  GetGenreByIdEvent({required this.id});

  final String id;
}