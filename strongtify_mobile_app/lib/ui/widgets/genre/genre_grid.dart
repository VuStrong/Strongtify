import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/models/genre/genre.dart';

class GenreGrid extends StatefulWidget {
  const GenreGrid({
    super.key,
    required this.genres
  });

  final List<Genre> genres;

  @override
  State<GenreGrid> createState() => _GenreGridState();
}

class _GenreGridState extends State<GenreGrid> {
  @override
  Widget build(BuildContext context) {
    return const Placeholder();
  }
}
