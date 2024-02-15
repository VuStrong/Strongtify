abstract class UserRecentPlaylistsEvent {}

class GetUserRecentPlaylistsEvent extends UserRecentPlaylistsEvent {
  final int take;

  GetUserRecentPlaylistsEvent({
    this.take = 5,
  });
}