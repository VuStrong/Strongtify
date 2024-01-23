import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:strongtify_mobile_app/blocs/auth/auth_bloc.dart';
import 'package:strongtify_mobile_app/blocs/auth/auth_event.dart';
import 'package:strongtify_mobile_app/blocs/playlist/bloc.dart';
import 'package:strongtify_mobile_app/components/button.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Button(
            buttonText: 'Logout',
            onPressed: () {
              context.read<AuthBloc>().add(AuthEventLogout());
            },
          ),
          Button(
            buttonText: 'Get',
            onPressed: () {
              context.read<PlaylistBloc>().add(GetCurrentUserPlaylists());
            },
          ),
          BlocBuilder<PlaylistBloc, PlaylistState>(builder: (context, state) {
            if (state.playlists != null) {
              return Expanded(
                child: ListView.builder(
                  itemCount: state.playlists!.items.length,
                  itemBuilder: (context, index) {
                    final item = state.playlists!.items[index];

                    return ListTile(
                      title: Text(
                        item.name,
                        style: const TextStyle(color: Colors.white),
                      ),
                    );
                  },
                ),
              );
            } else {
              return const Text(
                'No playlists',
                style: TextStyle(color: Colors.white70),
              );
            }
          })
        ],
      ),
    );
  }
}
