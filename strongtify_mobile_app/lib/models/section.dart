class Section<T> {
  final String title;
  final String type;
  final String? link;
  final List<T> items;

  Section({
    required this.title,
    required this.type,
    this.link,
    required this.items
  });
}
