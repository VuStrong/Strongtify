abstract class GetPlaylistsEvent {}

class GetCurrentUserPlaylistsEvent extends GetPlaylistsEvent {
  final int take;

  GetCurrentUserPlaylistsEvent({
    this.take = 5,
  });
}

class GetCurrentUserLikedPlaylistsEvent extends GetPlaylistsEvent {}

class GetMorePlaylistsEvent extends GetPlaylistsEvent {}