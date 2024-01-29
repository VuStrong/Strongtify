abstract class AlbumEvent {}

class GetAlbumByIdEvent extends AlbumEvent {
  final String id;

  GetAlbumByIdEvent({required this.id});
}