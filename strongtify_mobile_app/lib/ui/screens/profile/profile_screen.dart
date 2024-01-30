import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        foregroundColor: Colors.white,
        title: const Text(
          'Hồ sơ',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: ColorConstants.background,
      ),
      body: const Center(
        child: Text(
          'Profile',
          style: TextStyle(color: Colors.orange),
        ),
      ),
    );
  }
}
