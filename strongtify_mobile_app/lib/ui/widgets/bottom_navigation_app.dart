import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:persistent_bottom_nav_bar/persistent_tab_view.dart';
import 'package:strongtify_mobile_app/blocs/auth/auth_bloc.dart';
import 'package:strongtify_mobile_app/blocs/auth/auth_state.dart';
import 'package:strongtify_mobile_app/ui/screens/auth/login_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/collection_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/home_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/rank_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/search_screen.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class BottomNavigationApp extends StatelessWidget {
  BottomNavigationApp({super.key}) {
    _controller = PersistentTabController(initialIndex: 0);
  }

  static String id = 'bottom_navigation_app';

  late final PersistentTabController _controller;

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listener: (BuildContext context, AuthState state) {
        if (state.user == null) {
          Navigator.pushNamedAndRemoveUntil(
              context, LoginScreen.id, (route) => false);
        }
      },
      child: PersistentTabView(
        context,
        controller: _controller,
        screens: _buildScreens(),
        items: _navBarsItems(),
        confineInSafeArea: true,
        backgroundColor: Colors.black,
        decoration: NavBarDecoration(
          borderRadius: BorderRadius.circular(10.0),
          colorBehindNavBar: Colors.black,
        ),
        popAllScreensOnTapOfSelectedTab: true,
        popActionScreens: PopActionScreensType.all,
        itemAnimationProperties: const ItemAnimationProperties(
          // Navigation Bar's items animation properties.
          duration: Duration(milliseconds: 200),
          curve: Curves.ease,
        ),
        screenTransitionAnimation: const ScreenTransitionAnimation(
          // Screen transition animation on change of selected tab.
          animateTabTransition: true,
          curve: Curves.ease,
          duration: Duration(milliseconds: 200),
        ),
        navBarStyle: NavBarStyle.style6,
      ),
    );
  }

  List<Widget> _buildScreens() {
    return [
      const HomeScreen(),
      const SearchScreen(),
      const RankScreen(),
      const CollectionScreen(),
    ];
  }

  List<PersistentBottomNavBarItem> _navBarsItems() {
    return [
      PersistentBottomNavBarItem(
        icon: const Icon(Icons.home),
        title: ("Trang chủ"),
        activeColorPrimary: ColorConstants.primary,
        inactiveColorPrimary: Colors.white70,
      ),
      PersistentBottomNavBarItem(
        icon: const Icon(Icons.search_sharp),
        title: ("Tìm kiếm"),
        activeColorPrimary: ColorConstants.primary,
        inactiveColorPrimary: Colors.white70,
      ),
      PersistentBottomNavBarItem(
        icon: const Icon(Icons.plus_one_sharp),
        title: ("Xếp hạng"),
        activeColorPrimary: ColorConstants.primary,
        inactiveColorPrimary: Colors.white70,
      ),
      PersistentBottomNavBarItem(
        icon: const Icon(Icons.collections),
        title: ("Bộ sưu tập"),
        activeColorPrimary: ColorConstants.primary,
        inactiveColorPrimary: Colors.white70,
      ),
    ];
  }
}
