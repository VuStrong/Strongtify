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
  final String? keyword;

  GetCurrentUserPlaylistsEvent({
    this.take = 5,
    this.keyword,
  });
}

class GetCurrentUserLikedPlaylistsEvent extends GetPlaylistsEvent {}

class GetMorePlaylistsEvent extends GetPlaylistsEvent {}