abstract class ArtistDetailEvent {}

class GetArtistByIdEvent extends ArtistDetailEvent {
  GetArtistByIdEvent({required this.id});

  final String id;
}