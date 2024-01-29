import 'package:flutter/material.dart';

extension ContextExtension on BuildContext {
  double heightFraction({double sizeFraction = 1}) =>
      MediaQuery.sizeOf(this).height * sizeFraction;

  double widthFraction({double sizeFraction = 1}) =>
      MediaQuery.sizeOf(this).width * sizeFraction;
}

extension FormatLengthExtension on int {
  String toFormattedLength() {
    final second = this % 60;
    final minute = (this / 60).floor() % 60;
    final hour = (this / 60 / 60).floor();

    final hourStr = hour < 10 ? '0$hour' : '$hour';
    final minuteStr = minute < 10 ? '0$minute' : '$minute';
    final secondStr = second < 10 ? '0$second' : '$second';

    return hour == 0
        ? '$minuteStr:$secondStr'
        : '$hourStr:$minuteStr:$secondStr';
  }
}
