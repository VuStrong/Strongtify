import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:strongtify_mobile_app/blocs/app_bottom_navigation/bloc.dart';
import 'package:strongtify_mobile_app/screens/home_screen.dart';
import 'package:strongtify_mobile_app/screens/rank_screen.dart';
import 'package:strongtify_mobile_app/screens/search_screen.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class BottomNavigationApp extends StatelessWidget {
  const BottomNavigationApp({super.key});

  static String id = 'bottom_navigation_app';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocBuilder<AppBottomNavigationBloc, AppBottomNavigationState>(
        builder: (BuildContext context, AppBottomNavigationState state) {
          if (state.currentIndex == 0) {
            return const HomeScreen();
          }
          if (state.currentIndex == 1) {
            return const SearchScreen();
          }
          if (state.currentIndex == 2) {
            return const RankScreen();
          }

          return Container();
        },
      ),
      bottomNavigationBar:
          BlocBuilder<AppBottomNavigationBloc, AppBottomNavigationState>(
        builder: (BuildContext context, AppBottomNavigationState state) {
          return BottomNavigationBar(
            currentIndex: state.currentIndex,
            items: const <BottomNavigationBarItem>[
              BottomNavigationBarItem(
                icon: Icon(Icons.home),
                label: 'Trang chủ',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.search_sharp),
                label: 'Tìm kiếm',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.slideshow),
                label: 'Xếp hạng',
              ),
            ],
            selectedItemColor: ColorConstants.primary,
            unselectedItemColor: Colors.white70,
            backgroundColor: Colors.black,
            onTap: (index) {
              context
                  .read<AppBottomNavigationBloc>()
                  .add(AppBottomNavigationTapped(index: index));
            },
          );
        },
      ),
    );
  }
}
