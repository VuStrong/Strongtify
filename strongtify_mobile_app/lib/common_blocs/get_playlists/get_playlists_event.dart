abstract class GetPlaylistsEvent {}

class GetPlaylistsByParamsEvent extends GetPlaylistsEvent {
  final String? userId;
  final String? sort;

  GetPlaylistsByParamsEvent({
    this.userId,
    this.sort,
  });
}

class GetCurrentUserPlaylistsEvent extends GetPlaylistsEvent {
  final int take;

  GetCurrentUserPlaylistsEvent({
    this.take = 5,
  });
}

class GetCurrentUserLikedPlaylistsEvent extends GetPlaylistsEvent {}

class GetMorePlaylistsEvent extends GetPlaylistsEvent {}