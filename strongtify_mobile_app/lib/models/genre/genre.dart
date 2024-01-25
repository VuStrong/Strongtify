class Genre {
  final String id;
  final String name;
  final String alias;
  final String? imageUrl;

  Genre({
    required this.id,
    required this.name,
    required this.alias,
    this.imageUrl,
  });

  factory Genre.fromMap(Map<String, dynamic> data) {
    return Genre(
      id: data['id'],
      name: data['name'],
      alias: data['alias'],
      imageUrl: data['imageUrl'],
    );
  }
}
