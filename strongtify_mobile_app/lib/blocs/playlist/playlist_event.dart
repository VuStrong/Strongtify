abstract class PlaylistEvent {}

class GetPlaylistByIdEvent extends PlaylistEvent {
  final String id;

  GetPlaylistByIdEvent({required this.id});
}

class GetCurrentUserPlaylists extends PlaylistEvent {}