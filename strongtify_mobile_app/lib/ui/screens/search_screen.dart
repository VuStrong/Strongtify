import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shimmer/shimmer.dart';
import 'package:strongtify_mobile_app/blocs/genre/bloc.dart';
import 'package:strongtify_mobile_app/ui/widgets/appbar_account.dart';
import 'package:strongtify_mobile_app/ui/widgets/genre/genre_grid.dart';
import 'package:strongtify_mobile_app/ui/widgets/placeholders.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  @override
  void initState() {
    BlocProvider.of<GenreBloc>(context).add(GetAllGenresEvent());

    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Tìm kiếm',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: ColorConstants.background,
        leading: const AppbarAccount(),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              const SearchBar(
                padding: MaterialStatePropertyAll<EdgeInsets>(
                  EdgeInsets.symmetric(horizontal: 16.0),
                ),
                leading: Icon(Icons.search),
                hintText: 'Bạn muốn nghe gì?',
              ),
              const SizedBox(height: 32),
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'Chủ đề và thể loại',
                    textAlign: TextAlign.start,
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w700,
                      fontSize: 20,
                    ),
                  ),
                  const SizedBox(height: 16),
                  BlocBuilder<GenreBloc, GenreState>(
                    builder: (context, GenreState state) {
                      if (state is LoadedAllGenresState) {
                        return GenreGrid(genres: state.genres);
                      }

                      return _buildGenreGridShimmer();
                    },
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGenreGridShimmer() {
    return Shimmer.fromColors(
      baseColor: Colors.black12,
      highlightColor: ColorConstants.primary,
      enabled: true,
      child: SizedBox(
        height: 600,
        child: GridView.builder(
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisExtent: 120,
          ),
          shrinkWrap: true,
          padding: EdgeInsets.zero,
          itemCount: 10,
          physics: const NeverScrollableScrollPhysics(),
          itemBuilder: (_, position) => const BannerPlaceholder(height: 120),
        ),
      ),
    );
  }
}
