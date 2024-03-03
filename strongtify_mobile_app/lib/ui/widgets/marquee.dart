import 'package:flutter/material.dart';
import 'package:marquee/marquee.dart' as marquee_package;

class Marquee extends StatefulWidget {
  const Marquee({
    super.key,
    required this.text,
    this.onlyMoveIfTruncated = true,
    this.style,
    this.velocity = 100.0,
    this.blankSpace = 100.0,
  });

  final String text;
  final bool onlyMoveIfTruncated;
  final TextStyle? style;
  final double velocity;
  final double blankSpace;

  @override
  State<Marquee> createState() => _MarqueeState();
}

class _MarqueeState extends State<Marquee> {
  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, size) {
        var tp = TextPainter(
          maxLines: 1,
          textAlign: TextAlign.center,
          textDirection: TextDirection.ltr,
          text: TextSpan(
            text: widget.text,
            style: TextStyle(
              fontWeight: widget.style?.fontWeight,
              fontSize: widget.style?.fontSize,
            ),
          ),
        );

        tp.layout(maxWidth: size.maxWidth);

        final exceeded = tp.didExceedMaxLines;

        if (!exceeded && widget.onlyMoveIfTruncated) {
          return Text(
            widget.text,
            style: widget.style,
          );
        }

        return SizedBox(
          height: tp.height,
          child: marquee_package.Marquee(
            text: widget.text,
            style: widget.style,
            blankSpace: widget.blankSpace,
            velocity: widget.velocity,
          ),
        );
      },
    );
  }
}
