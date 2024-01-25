import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class SongItem extends StatefulWidget {
  const SongItem({
    super.key,
    required this.song,
    this.isPlaying = false,
  });

  final Song song;
  final bool isPlaying;

  @override
  State<SongItem> createState() => _SongItemState();
}

class _SongItemState extends State<SongItem> {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsetsDirectional.only(start: 5, end: 5),
      decoration: BoxDecoration(
        color: widget.isPlaying
            ? ColorConstants.primary.withOpacity(0.5)
            : ColorConstants.background,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.max,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          SizedBox(
            width: 54,
            height: 54,
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
                    style: TextStyle(
                      color: widget.isPlaying
                          ? ColorConstants.primary
                          : Colors.white,
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
      ),
    );
  }
}
