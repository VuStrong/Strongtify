abstract class PlaylistDetailEvent {}

class GetPlaylistByIdEvent extends PlaylistDetailEvent {
  final String id;

  GetPlaylistByIdEvent({required this.id});
}