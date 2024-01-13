import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

Future<void> showSuccessDialog({
  required BuildContext context,
  required String text,
}) {
  return showDialog<void>(
    context: context,
    builder: (context) {
      return AlertDialog(
        title: const Text('Thành công!', style: TextStyle(color: Colors.cyanAccent)),
        content: Text(text, style: const TextStyle(color: Colors.white70)),
        backgroundColor: Colors.black,
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            child: const Text('OK', style: TextStyle(color: ColorConstants.primary)),
          ),
        ],
      );
    },
  );
}
