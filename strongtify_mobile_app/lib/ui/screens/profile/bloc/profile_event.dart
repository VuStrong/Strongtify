abstract class ProfileEvent {}

class GetProfileByUserIdEvent extends ProfileEvent {
  final String id;

  GetProfileByUserIdEvent({required this.id});
}