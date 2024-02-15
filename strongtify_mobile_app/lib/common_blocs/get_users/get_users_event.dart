abstract class GetUsersEvent {}

class GetFollowingUsersEvent extends GetUsersEvent {
  GetFollowingUsersEvent({
    required this.userId,
  });

  final String userId;
}

class GetFollowersEvent extends GetUsersEvent {
  GetFollowersEvent({
    required this.userId,
  });

  final String userId;
}

class GetMoreUsersEvent extends GetUsersEvent {}