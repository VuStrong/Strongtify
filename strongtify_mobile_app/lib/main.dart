import 'package:audio_service/audio_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:loader_overlay/loader_overlay.dart';
import 'package:strongtify_mobile_app/common_blocs/auth/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/player/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/playlist_songs/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/user_favs/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/user_recent_playlists/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/ui/screens/auth/confirm_email_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/auth/forgot_password_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/auth/login_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/auth/register_screen.dart';
import 'package:strongtify_mobile_app/ui/widgets/bottom_navigation_app.dart';
import 'package:strongtify_mobile_app/services/audio_handler_impl.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

Future main() async {
  await dotenv.load(fileName: ".env");

  configureDependencies();

  await AudioService.init(
    builder: () => AudioHandlerImpl(),
    config: const AudioServiceConfig(
      androidNotificationChannelName: 'Music playback',
      androidNotificationOngoing: true,
    ),
  );

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
        BlocProvider<UserRecentPlaylistsBloc>(
          lazy: false,
          create: (BuildContext context) => getIt<UserRecentPlaylistsBloc>(),
        ),
        BlocProvider<PlaylistSongsBloc>(
          lazy: false,
          create: (BuildContext context) => getIt<PlaylistSongsBloc>(),
        ),
        BlocProvider<PlayerBloc>(
          lazy: false,
          create: (BuildContext context) => getIt<PlayerBloc>(),
        ),
        BlocProvider<UserFavsBloc>(
          lazy: false,
          create: (BuildContext context) => getIt<UserFavsBloc>(),
        ),
      ],
      child: GlobalLoaderOverlay(
        overlayColor: Colors.black.withOpacity(0.8),
        child: MaterialApp(
          title: 'Strongtify',
          debugShowCheckedModeBanner: false,
          theme: ThemeData(
            primarySwatch: Colors.orange,
            scaffoldBackgroundColor: ColorConstants.background,
          ),
          home: BlocBuilder<AuthBloc, AuthState>(
            builder: (context, AuthState state) {
              if (state.isInitializing) {
                return const Center(
                  child: CircularProgressIndicator(
                    color: ColorConstants.primary,
                  ),
                );
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
          routes: {
            LoginScreen.id: (context) => const LoginScreen(),
            RegisterScreen.id: (context) => const RegisterScreen(),
            ForgotPasswordScreen.id: (context) => const ForgotPasswordScreen(),
            ConfirmEmailScreen.id: (context) => const ConfirmEmailScreen(),
            BottomNavigationApp.id: (context) => const BottomNavigationApp(),
          },
        ),
      ),
    );
  }
}
