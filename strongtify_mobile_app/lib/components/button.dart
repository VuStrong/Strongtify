import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class Button extends StatelessWidget {
  const Button(
      {super.key,
      required this.buttonText,
      this.isOutlined = false,
      required this.onPressed,
      this.width});

  final String buttonText;
  final bool isOutlined;
  final Function onPressed;
  final double? width;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        onPressed();
      },
      child: Material(
        borderRadius: BorderRadius.circular(30),
        elevation: 4,
        child: Container(
          width: width,
          padding: const EdgeInsets.all(5),
          decoration: BoxDecoration(
            color: isOutlined ? Colors.black : ColorConstants.primary,
            border: Border.all(color: ColorConstants.primary, width: 2.2),
            borderRadius: BorderRadius.circular(30),
          ),
          child: Center(
            child: Text(
              buttonText,
              style: TextStyle(
                fontWeight: FontWeight.w500,
                fontSize: 20,
                color: isOutlined ? Colors.white70 : Colors.black,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
