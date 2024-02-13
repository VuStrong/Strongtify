import 'package:strongtify_mobile_app/utils/enums.dart';

class Account {
  Account({
    required this.id,
    required this.name,
    required this.alias,
    required this.email,
    this.imageUrl,
    this.emailConfirmed = false,
    this.locked = false,
    required this.role,
    this.about,
  });

  final String id;
  final String name;
  final String alias;
  final String email;
  final String? imageUrl;
  final bool emailConfirmed;
  final bool locked;
  final Role role;
  final String? about;

  static Account fromMap(Map<String, dynamic> data) {
    return Account(
      id: data['id'],
      name: data['name'],
      alias: data['alias'],
      email: data['email'],
      role: data['role'] == 'MEMBER' ? Role.member : Role.admin,
      imageUrl: data['imageUrl'],
      emailConfirmed: data['emailConfirmed'],
      locked: data['locked'],
      about: data['about'],
    );
  }
}
