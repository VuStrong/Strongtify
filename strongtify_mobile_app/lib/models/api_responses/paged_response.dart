class PagedResponse<T> {
  PagedResponse(
      {required this.items,
        this.total = 0,
        this.skip = 0,
        this.take = 0,
        this.end = false});

  final List<T> items;
  final int total;
  final int skip;
  final int take;
  final bool end;
}
