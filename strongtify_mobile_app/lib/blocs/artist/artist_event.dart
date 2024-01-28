abstract class ArtistEvent {}

class GetArtistByIdEvent extends ArtistEvent {
  GetArtistByIdEvent({required this.id});

  final String id;
}