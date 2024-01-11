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
  });

  final String id;
  final String name;
  final String alias;
  final String email;
  final String? imageUrl;
  final bool emailConfirmed;
  final bool locked;
  final Role role;

  static Account fromJson(Map<String, dynamic> json) {
    return Account(
      id: json['id'],
      name: json['name'],
      alias: json['alias'],
      email: json['email'],
      role: json['role'] == 'MEMBER' ? Role.member : Role.admin,
      imageUrl: json['imageUrl'],
      emailConfirmed: json['emailConfirmed'],
      locked: json['locked'],
    );
  }
}
