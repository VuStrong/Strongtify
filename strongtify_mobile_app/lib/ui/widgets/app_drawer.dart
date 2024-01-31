import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:persistent_bottom_nav_bar/persistent_tab_view.dart';
import 'package:strongtify_mobile_app/common_blocs/auth/bloc.dart';
import 'package:strongtify_mobile_app/ui/screens/profile/profile_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/settings/settings_screen.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: Colors.grey.shade900,
      child: ListView(
        padding: const EdgeInsets.only(
          right: 0,
          left: 0,
          top: 35,
        ),
        children: [
          BlocBuilder<AuthBloc, AuthState>(
            builder: (context, AuthState state) {
              if (state.user != null) {
                return ListTile(
                  onTap: () {
                    PersistentNavBarNavigator.pushNewScreen(
                      context,
                      screen: ProfileScreen(
                        userId: state.user!.id,
                      ),
                    );
                  },
                  leading: ClipOval(
                    child: state.user!.imageUrl != null
                        ? Image.network(
                            state.user!.imageUrl!,
                            fit: BoxFit.cover,
                          )
                        : Image.asset('assets/img/default-avatar.png'),
                  ),
                  title: Text(
                    state.user!.name,
                    style: const TextStyle(color: Colors.white),
                  ),
                  subtitle: const Text(
                    'Xem hồ sơ',
                    style: TextStyle(color: Colors.white54),
                  ),
                );
              }

              return const SizedBox();
            },
          ),
          const SizedBox(height: 12),
          const Divider(
            height: 1,
            thickness: 1,
            color: Colors.white30,
          ),
          ListTile(
            textColor: Colors.white70,
            iconColor: Colors.white70,
            leading: const Icon(Icons.settings),
            title: const Text('Cài đặt'),
            onTap: () {
              PersistentNavBarNavigator.pushNewScreen(
                context,
                screen: const SettingsScreen(),
              );
            },
          ),
        ],
      ),
    );
  }
}
