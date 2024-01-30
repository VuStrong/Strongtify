abstract class AlbumDetailEvent {}

class GetAlbumByIdEvent extends AlbumDetailEvent {
  final String id;

  GetAlbumByIdEvent({required this.id});
}