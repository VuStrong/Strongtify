import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:persistent_bottom_nav_bar/persistent_tab_view.dart';
import 'package:strongtify_mobile_app/common_blocs/get_genres/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/ui/screens/search/search_result_screen.dart';
import 'package:strongtify_mobile_app/ui/widgets/app_drawer.dart';
import 'package:strongtify_mobile_app/ui/widgets/appbar_account.dart';
import 'package:strongtify_mobile_app/ui/widgets/genre/genre_grid.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  @override
  Widget build(BuildContext context) {
    return BlocProvider<GetGenresBloc>(
      create: (context) => getIt<GetGenresBloc>()..add(GetAllGenresEvent()),
      child: Scaffold(
        appBar: AppBar(
          title: const Text(
            'Tìm kiếm',
            style: TextStyle(color: Colors.white),
          ),
          backgroundColor: ColorConstants.background,
          leading: const AppbarAccount(),
        ),
        drawer: const AppDrawer(),
        body: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                SearchBar(
                  padding: const MaterialStatePropertyAll<EdgeInsets>(
                    EdgeInsets.symmetric(horizontal: 16.0),
                  ),
                  leading: const Icon(Icons.search),
                  hintText: 'Bạn muốn nghe gì?',
                  onSubmitted: (String value) {
                    if (value.isEmpty) {
                      return;
                    }

                    PersistentNavBarNavigator.pushNewScreen(
                      context,
                      screen: SearchResultScreen(searchValue: value),
                    );
                  },
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
                    BlocBuilder<GetGenresBloc, GetGenresState>(
                      builder: (context, GetGenresState state) {
                        if (!state.isLoading) {
                          return GenreGrid(genres: state.genres ?? []);
                        }

                        return const Center(
                          child: CircularProgressIndicator(
                            color: ColorConstants.primary,
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
