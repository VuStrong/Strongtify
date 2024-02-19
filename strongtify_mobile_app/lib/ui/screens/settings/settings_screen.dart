import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:persistent_bottom_nav_bar_v2/persistent-tab-view.dart';
import 'package:strongtify_mobile_app/common_blocs/auth/bloc.dart';
import 'package:strongtify_mobile_app/ui/screens/settings/change_password/change_password_screen.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        foregroundColor: Colors.white,
        title: const Text(
          'Cài đặt',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: ColorConstants.background,
      ),
      body: ListView(
        children: [
          ListTile(
            textColor: Colors.white70,
            iconColor: Colors.white70,
            leading: const Icon(Icons.password),
            title: const Text('Mật khẩu'),
            onTap: () {
              pushNewScreen(
                context,
                screen: const ChangePasswordScreen(),
                withNavBar: false,
              );
            },
          ),
          const Divider(
            height: 1,
            thickness: 1,
            color: Colors.white30,
          ),
          ListTile(
            textColor: Colors.white70,
            iconColor: Colors.white70,
            leading: const Icon(Icons.logout),
            title: const Text('Đăng xuất'),
            onTap: () {
              context.read<AuthBloc>().add(AuthEventLogout());
            },
          ),
        ],
      ),
    );
  }
}
