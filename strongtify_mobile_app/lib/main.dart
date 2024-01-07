import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:strongtify_mobile_app/blocs/auth/auth_bloc.dart';
import 'package:strongtify_mobile_app/blocs/auth/auth_state.dart';
import 'package:strongtify_mobile_app/screens/auth/login_screen.dart';
import 'package:strongtify_mobile_app/screens/auth/register_screen.dart';
import 'package:strongtify_mobile_app/screens/home_screen.dart';

import 'enums/status.dart';

void main() {
  runApp(const StrongtifyApp());
}

class StrongtifyApp extends StatelessWidget {
  const StrongtifyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: <BlocProvider<dynamic>>[
        BlocProvider<AuthBloc>(
          lazy: false,
          create: (BuildContext context) => AuthBloc(),
        ),
      ],
      child: MaterialApp(
        title: 'Strongtify',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        home: BlocConsumer<AuthBloc, AuthState>(
          listener: (context, state) {},
          builder: (context, AuthState state) {
            if (state.status == Status.inProgress) {
              return const CircularProgressIndicator();
            }

            if (state.user != null) {
              return const HomeScreen();
            } else {
              return const LoginScreen();
            }
          },
        ),
        routes: {
          LoginScreen.id: (context) => const LoginScreen(),
          RegisterScreen.id: (context) => const RegisterScreen(),
        },
      ),
    );
  }
}
