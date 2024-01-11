import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:loader_overlay/loader_overlay.dart';
import 'package:strongtify_mobile_app/blocs/auth/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/screens/auth/login_screen.dart';
import 'package:strongtify_mobile_app/screens/auth/register_screen.dart';
import 'package:strongtify_mobile_app/screens/home_screen.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

Future main() async {
  await dotenv.load(fileName: ".env");

  configureDependencies();

  await show();

  runApp(const StrongtifyApp());
}

Future<void> clear() async {
  var storage = const FlutterSecureStorage();

  await storage.deleteAll();
}

Future<void> show() async {
  var storage = const FlutterSecureStorage();

  print('Access Token: ' + (await storage.read(key: 'access_token'))!);
  print('Refresh Token: ' + (await storage.read(key: 'refresh_token'))!);
  print('Access Token: ' + (await storage.read(key: 'access_token_expired_at'))!);
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
                return const HomeScreen();
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
