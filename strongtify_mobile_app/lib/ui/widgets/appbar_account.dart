import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/auth/bloc.dart';

class AppbarAccount extends StatelessWidget {
  const AppbarAccount({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(5),
      child: BlocBuilder<AuthBloc, AuthState>(
        builder: (context, AuthState state) {
          return GestureDetector(
            onTap: () {
              Scaffold.of(context).openDrawer();
            },
            child: ClipOval(
              child: state.user?.imageUrl != null
                  ? Image.network(
                      state.user!.imageUrl!,
                      fit: BoxFit.cover,
                    )
                  : Image.asset('assets/img/default-avatar.png'),
            ),
          );
        },
      ),
    );
  }
}
