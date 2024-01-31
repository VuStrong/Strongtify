import 'package:flutter/material.dart';

void showSuccessSnackBar(
  BuildContext context, {
  required String text,
}) {
  final snackBar = SnackBar(
    content: Text(
      text,
      style: const TextStyle(color: Colors.greenAccent),
    ),
    showCloseIcon: true,
    padding: const EdgeInsets.only(bottom: 20, left: 10),
  );

  ScaffoldMessenger.of(context).showSnackBar(snackBar);
}
