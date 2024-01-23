import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:strongtify_mobile_app/blocs/auth/bloc.dart';
import 'package:strongtify_mobile_app/components/button.dart';

class CollectionScreen extends StatefulWidget {
  const CollectionScreen({super.key});

  static String id = 'collection_screen';

  @override
  State<CollectionScreen> createState() => _CollectionScreenState();
}

class _CollectionScreenState extends State<CollectionScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Button(
          buttonText: 'logout test',
          onPressed: () {
            context.read<AuthBloc>().add(AuthEventLogout());
          },
        ),
      ),
    );
  }
}
