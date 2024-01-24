class Artist {
  Artist({
    required this.id,
    required this.name,
    required this.alias,
    this.imageUrl,
    this.followerCount = 0,
  });

  final String id;
  final String name;
  final String alias;
  final String? imageUrl;
  final int followerCount;

  factory Artist.fromMap(Map<String, dynamic> data) {
    return Artist(
      id: data['id'],
      name: data['name'],
      alias: data['alias'],
      imageUrl: data['imageUrl'],
      followerCount: data['followerCount'] ?? 0,
    );
  }
}
