import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class ClickableItem extends StatelessWidget {
  const ClickableItem({
    super.key,
    required this.title,
    this.isActive = false,
    this.onClick,
  });

  final bool isActive;
  final Function? onClick;
  final String title;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        if (onClick != null) onClick!();
      },
      child: Padding(
        padding: const EdgeInsets.only(right: 5, left: 5),
        child: Container(
          padding:
              const EdgeInsets.only(top: 10, bottom: 10, right: 20, left: 20),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10),
            color: isActive
                ? ColorConstants.primary
                : Colors.grey.shade900,
          ),
          child: Center(
            child: Text(
              title,
              style: const TextStyle(color: Colors.white),
            ),
          ),
        ),
      ),
    );
  }
}
