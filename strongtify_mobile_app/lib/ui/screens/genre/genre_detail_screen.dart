import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:strongtify_mobile_app/blocs/genre/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class GenreDetailScreen extends StatefulWidget {
  const GenreDetailScreen({
    super.key,
    required this.genreId,
  });

  final String genreId;

  @override
  State<GenreDetailScreen> createState() => _GenreDetailScreenState();
}

class _GenreDetailScreenState extends State<GenreDetailScreen> {
  @override
  Widget build(BuildContext context) {
    return BlocProvider<GenreBloc>(
      create: (context) =>
          getIt<GenreBloc>()..add(GetGenreByIdEvent(id: widget.genreId)),
      child: BlocBuilder<GenreBloc, GenreState>(
        builder: (context, GenreState state) {
          if (state is LoadedGenreByIdState) {
            return Center(
              child: Text(
                state.genre?.name ?? 'null',
                style: const TextStyle(color: Colors.white),
              ),
            );
          }

          return const Center(
            child: CircularProgressIndicator(
              color: ColorConstants.primary,
            ),
          );
        },
      ),
    );
  }
}
