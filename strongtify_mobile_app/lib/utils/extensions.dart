import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

extension ContextExtension on BuildContext {
  double heightFraction({double sizeFraction = 1}) =>
      MediaQuery.sizeOf(this).height * sizeFraction;

  double widthFraction({double sizeFraction = 1}) =>
      MediaQuery.sizeOf(this).width * sizeFraction;
}

// int
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

// FToast
extension FToastExtension on FToast {
  void showSuccessToast({required String msg}) {
    Widget toast = Container(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(25.0),
        color: Colors.greenAccent,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.check),
          const SizedBox(width: 12.0),
          Text(msg),
        ],
      ),
    );

    removeQueuedCustomToasts();
    showToast(
      child: toast,
      gravity: ToastGravity.BOTTOM,
      toastDuration: const Duration(seconds: 2),
    );
  }

  void showErrorToast({required String msg}) {
    Widget toast = Container(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(25.0),
        color: Colors.redAccent,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.error),
          const SizedBox(width: 12.0),
          Text(msg),
        ],
      ),
    );

    removeQueuedCustomToasts();
    showToast(
      child: toast,
      gravity: ToastGravity.BOTTOM,
      toastDuration: const Duration(seconds: 2),
    );
  }

  void showLoadingToast({required String msg}) {
    Widget toast = Container(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(25.0),
        color: Colors.white,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(
              color: ColorConstants.primary,
            ),
          ),
          const SizedBox(width: 12.0),
          Text(
            msg,
            style: const TextStyle(color: Colors.black),
          ),
        ],
      ),
    );

    removeQueuedCustomToasts();
    showToast(
      child: toast,
      gravity: ToastGravity.BOTTOM,
      toastDuration: const Duration(seconds: 10),
    );
  }
}
