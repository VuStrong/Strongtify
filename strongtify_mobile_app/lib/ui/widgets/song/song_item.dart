import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class SongItem extends StatefulWidget {
  const SongItem({
    super.key,
    required this.song,
    this.isPlaying = false,
    this.onPressed,
    this.onPressAction,
    this.actionIcon,
  });

  final Song song;
  final bool isPlaying;
  final void Function()? onPressed;
  final void Function()? onPressAction;
  final Icon? actionIcon;

  @override
  State<SongItem> createState() => _SongItemState();
}

class _SongItemState extends State<SongItem> {
  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: SizedBox(
        width: 56,
        height: 56,
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
      title: Text(
        widget.song.name,
        style: TextStyle(
          color: widget.isPlaying ? ColorConstants.primary : Colors.white,
          overflow: TextOverflow.ellipsis,
        ),
      ),
      subtitle: Text(
        widget.song.artists?.map((artist) => artist.name).join(', ') ?? '',
        style: const TextStyle(
          color: Colors.white54,
          overflow: TextOverflow.ellipsis,
        ),
      ),
      tileColor: widget.isPlaying
          ? ColorConstants.primary.withOpacity(0.5)
          : Colors.transparent,
      contentPadding: const EdgeInsets.only(right: 5, left: 5),
      onTap: widget.onPressed != null
          ? () {
              widget.onPressed!();
            }
          : null,
      trailing: widget.actionIcon != null
          ? IconButton(
              icon: widget.actionIcon!,
              onPressed: () {
                if (widget.onPressAction != null) widget.onPressAction!();
              },
            )
          : null,
    );
  }
}
