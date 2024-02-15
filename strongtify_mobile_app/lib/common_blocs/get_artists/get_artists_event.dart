abstract class GetArtistsEvent {}

class GetFollowingArtistsEvent extends GetArtistsEvent {
  final String userId;

  GetFollowingArtistsEvent({
   required this.userId,
  });
}

class GetMoreArtistsEvent extends GetArtistsEvent {}