import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';

class SongItem extends StatefulWidget {
  const SongItem({super.key, required this.song});

  final Song song;

  @override
  State<SongItem> createState() => _SongItemState();
}

class _SongItemState extends State<SongItem> {
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.max,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Container(
          width: 54,
          height: 54,
          decoration: const BoxDecoration(
            color: Colors.black,
            shape: BoxShape.rectangle,
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: widget.song.imageUrl != null
                ? Image.network(
                    widget.song.imageUrl!,
                    fit: BoxFit.cover,
                  )
                : Image.asset('assets/img/default-song-img.png'),
          ),
        ),
        Expanded(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ListTile(
                title: Text(
                  widget.song.name,
                  style: const TextStyle(
                    color: Colors.white,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                subtitle: Text(
                  widget.song.artists
                          ?.map((artist) => artist.name)
                          .join(', ') ??
                      '',
                  style: const TextStyle(
                      color: Colors.white54, overflow: TextOverflow.ellipsis),
                ),
              ),
            ],
          ),
        )
      ],
    );
  }
}
