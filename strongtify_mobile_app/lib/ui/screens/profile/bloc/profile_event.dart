import 'dart:io';

abstract class ProfileEvent {}

class GetProfileByUserIdEvent extends ProfileEvent {
  final String id;

  GetProfileByUserIdEvent({required this.id});
}

class EditProfileEvent extends ProfileEvent {
  final String name;
  final String? about;
  final File? image;

  EditProfileEvent({
    required this.name,
    this.about,
    this.image,
  });
}
