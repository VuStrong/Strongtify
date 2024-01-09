import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

Future<void> showErrorDialog({
  required BuildContext context,
  required String error,
}) {
  return showDialog<void>(
    context: context,
    builder: (context) {
      return AlertDialog(
        title: const Text('Oops!', style: TextStyle(color: Colors.white)),
        content: Text(error, style: const TextStyle(color: Colors.white70)),
        backgroundColor: Colors.black,
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            child: const Text('Close', style: TextStyle(color: ColorConstants.primary)),
          ),
        ],
      );
    },
  );
}
