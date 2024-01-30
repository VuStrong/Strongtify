abstract class GenreDetailEvent {}

class GetGenreByIdEvent extends GenreDetailEvent {
  GetGenreByIdEvent({required this.id});

  final String id;
}