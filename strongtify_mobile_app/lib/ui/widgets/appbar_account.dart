import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:persistent_bottom_nav_bar/persistent_tab_view.dart';
import 'package:strongtify_mobile_app/blocs/auth/bloc.dart';
import 'package:strongtify_mobile_app/ui/screens/profile_screen.dart';

class AppbarAccount extends StatelessWidget {
  const AppbarAccount({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(5),
      child: GestureDetector(
        onTap: () {
          PersistentNavBarNavigator.pushNewScreen(
            context,
            screen: const ProfileScreen(),
          );
        },
        child: ClipOval(
          child: context.read<AuthBloc>().state.user?.imageUrl != null
              ? Image.network(
                  context.read<AuthBloc>().state.user!.imageUrl!,
                  fit: BoxFit.cover,
                )
              : Image.asset('assets/img/default-avatar.png'),
        ),
      ),
    );
  }
}
