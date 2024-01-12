class User {
  User(
      {required this.id,
      required this.name,
      required this.alias,
      this.imageUrl,
      this.followerCount = 0});

  final String id;
  final String name;
  final String alias;
  final String? imageUrl;
  final int followerCount;

  factory User.fromMap(Map<String, dynamic> data) {
    return User(
        id: data['id'],
        name: data['name'],
        alias: data['alias'],
        imageUrl: data['imageUrl'],
        followerCount: data['followerCount'] ?? 0);
  }
}
