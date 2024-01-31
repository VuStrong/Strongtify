abstract class PlaylistsEvent {}

class GetCurrentUserPlaylistsEvent extends PlaylistsEvent {
  final int take;

  GetCurrentUserPlaylistsEvent({
    this.take = 5,
  });
}

class GetMorePlaylistsEvent extends PlaylistsEvent {}