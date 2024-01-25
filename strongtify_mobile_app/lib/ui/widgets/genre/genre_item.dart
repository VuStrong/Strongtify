import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/models/genre/genre.dart';

class GenreItem extends StatefulWidget {
  const GenreItem({super.key, required this.genre});

  final Genre genre;

  @override
  State<GenreItem> createState() => _GenreItemState();
}

class _GenreItemState extends State<GenreItem> {
  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 16 / 9,
      child: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          color: Colors.black,
          borderRadius: BorderRadius.circular(16),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: widget.genre.imageUrl != null
              ? Image.network(
                  widget.genre.imageUrl!,
                  fit: BoxFit.cover,
                )
              : Image.asset('assets/img/default-song-img.png'),
        ),
      ),
    );
  }
}
