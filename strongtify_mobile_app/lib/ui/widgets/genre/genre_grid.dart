import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/models/genre/genre.dart';
import 'package:strongtify_mobile_app/ui/widgets/genre/genre_item.dart';

class GenreGrid extends StatefulWidget {
  const GenreGrid({super.key, required this.genres});

  final List<Genre> genres;

  @override
  State<GenreGrid> createState() => _GenreGridState();
}

class _GenreGridState extends State<GenreGrid> {
  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisExtent: 120,
        // mainAxisSpacing: 5,
        crossAxisSpacing: 10,
      ),
      shrinkWrap: true,
      padding: EdgeInsets.zero,
      itemCount: widget.genres.length,
      physics: const NeverScrollableScrollPhysics(),
      itemBuilder: (_, index) => GenreItem(genre: widget.genres[index]),
    );
  }
}
