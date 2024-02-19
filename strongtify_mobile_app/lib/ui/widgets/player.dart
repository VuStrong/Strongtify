import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class Player extends StatefulWidget {
  const Player({super.key});

  @override
  State<Player> createState() => _PlayerState();
}

class _PlayerState extends State<Player> {
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: ColorConstants.primary,
      ),
      height: 60,
    );
  }
}
