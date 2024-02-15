import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

Future<bool> showPromptDialog({
  required BuildContext context,
  required String prompt,
  required String title,
}) async {
  return (await showDialog<bool>(
    context: context,
    builder: (context) {
      return AlertDialog(
        title: Text(title, style: const TextStyle(color: Colors.white)),
        content: Text(prompt, style: const TextStyle(color: Colors.white54)),
        backgroundColor: Colors.grey[850],
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop(false);
            },
            child: const Text('Hủy', style: TextStyle(color: Colors.white70)),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop(true);
            },
            child: const Text('OK', style: TextStyle(color: ColorConstants.primary)),
          ),
        ],
      );
    },
  )) ?? false;
}
