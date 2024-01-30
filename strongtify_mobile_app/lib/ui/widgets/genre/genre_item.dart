import 'package:flutter/material.dart';
import 'package:persistent_bottom_nav_bar/persistent_tab_view.dart';
import 'package:strongtify_mobile_app/models/genre/genre.dart';
import 'package:strongtify_mobile_app/ui/screens/genre_detail/genre_detail_screen.dart';

class GenreItem extends StatefulWidget {
  const GenreItem({super.key, required this.genre});

  final Genre genre;

  @override
  State<GenreItem> createState() => _GenreItemState();
}

class _GenreItemState extends State<GenreItem> {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        PersistentNavBarNavigator.pushNewScreen(
          context,
          screen: GenreDetailScreen(genreId: widget.genre.id),
        );
      },
      child: Container(
        width: double.infinity,
        height: 120,
        decoration: BoxDecoration(
          image: DecorationImage(
            image: widget.genre.imageUrl != null
                ? NetworkImage(widget.genre.imageUrl!)
                : const AssetImage('assets/img/default-song-img.png')
                    as ImageProvider,
          ),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.black.withOpacity(0.5),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Center(
            child: Text(
              widget.genre.name,
              style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  overflow: TextOverflow.ellipsis),
            ),
          ),
        ),
      ),
    );
  }
}
