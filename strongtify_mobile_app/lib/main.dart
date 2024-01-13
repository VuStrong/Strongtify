import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:loader_overlay/loader_overlay.dart';
import 'package:strongtify_mobile_app/blocs/app_bottom_navigation/bloc.dart';
import 'package:strongtify_mobile_app/blocs/auth/bloc.dart';
import 'package:strongtify_mobile_app/blocs/playlist/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/screens/auth/confirm_email_screen.dart';
import 'package:strongtify_mobile_app/screens/auth/login_screen.dart';
import 'package:strongtify_mobile_app/screens/auth/register_screen.dart';
import 'package:strongtify_mobile_app/utils/common_widgets/bottom_navigation_app.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

Future main() async {
  await dotenv.load(fileName: ".env");

  configureDependencies();

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
          create: (BuildContext context) => getIt<AuthBloc>(),
        ),
        BlocProvider<AppBottomNavigationBloc>(
          lazy: false,
          create: (BuildContext context) => getIt<AppBottomNavigationBloc>(),
        ),
        BlocProvider<PlaylistBloc>(
          lazy: false,
          create: (BuildContext context) => getIt<PlaylistBloc>(),
        ),
      ],
      child: MaterialApp(
        title: 'Strongtify',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          primarySwatch: Colors.orange,
          scaffoldBackgroundColor: ColorConstants.background
        ),
        home: LoaderOverlay(
          overlayColor: Colors.black.withOpacity(0.8),
          child: BlocConsumer<AuthBloc, AuthState>(
            listener: (context, state) {},
            builder: (context, AuthState state) {
              if (state.isInitializing) {
                return const CircularProgressIndicator();
              }

              if (state.user != null) {
                if (state.user!.emailConfirmed == false) {
                  return const ConfirmEmailScreen();
                }

                return const BottomNavigationApp();
              } else {
                return const LoginScreen();
              }
            },
          ),
        ),
        routes: {
          LoginScreen.id: (context) => const LoginScreen(),
          RegisterScreen.id: (context) => const RegisterScreen(),
        },
      ),
    );
  }
}
