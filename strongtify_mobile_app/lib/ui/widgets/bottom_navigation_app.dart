import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:persistent_bottom_nav_bar_v2/persistent-tab-view.dart';
import 'package:strongtify_mobile_app/common_blocs/auth/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/player/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/playlist_songs/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/user_recent_playlists/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/ui/screens/auth/login_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/collection/collection_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/home/home_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/rank/rank_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/search/search_screen.dart';
import 'package:strongtify_mobile_app/ui/widgets/custom_nav_bar.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';
import 'package:strongtify_mobile_app/utils/extensions.dart';

class BottomNavigationApp extends StatefulWidget {
  const BottomNavigationApp({super.key});

  static String id = 'bottom_navigation_app';

  @override
  State<BottomNavigationApp> createState() => _BottomNavigationAppState();
}

class _BottomNavigationAppState extends State<BottomNavigationApp> {
  @override
  void initState() {
    _controller = PersistentTabController(initialIndex: 0);

    fToast = FToast();

    getIt<UserRecentPlaylistsBloc>().add(GetUserRecentPlaylistsEvent());

    super.initState();
  }

  late final PersistentTabController _controller;
  late final FToast fToast;
  double _navBarHeight = 61;

  @override
  Widget build(BuildContext context) {
    return MultiBlocListener(
      listeners: [
        BlocListener<AuthBloc, AuthState>(
          listener: (BuildContext context, AuthState state) {
            if (state.user == null) {
              Navigator.pushNamedAndRemoveUntil(
                  context, LoginScreen.id, (route) => false);
            }
          },
        ),
        BlocListener<PlaylistSongsBloc, PlaylistSongsState>(
          listener: (BuildContext context, PlaylistSongsState state) {
            fToast.init(context);

            if (state.status == PlaylistSongsStatus.added) {
              fToast.showSuccessToast(msg: 'Đã thêm bài hát!');
            } else if (state.status == PlaylistSongsStatus.error) {
              fToast.showErrorToast(msg: state.errorMessage ?? '');
            }
          },
        ),
        BlocListener<PlayerBloc, PlayerState>(
          listener: (context, PlayerState state) {
            if (state.songs == null || state.songs!.isEmpty) {
              setState(() {
                _navBarHeight = 61;
              });

              return;
            }

            setState(() {
              _navBarHeight = 131;
            });
          },
        ),
      ],
      child: _buildNavBar(context),
    );
  }

  Widget _buildNavBar(BuildContext context) {
    return PersistentTabView.custom(
      context,
      controller: _controller,
      itemCount: 4,
      screens: _buildScreens(),
      backgroundColor: Colors.transparent,
      navBarHeight: _navBarHeight,
      confineInSafeArea: true,
      popAllScreensOnTapOfSelectedTab: true,
      handleAndroidBackButtonPress: false,
      onWillPop: (context) async {
        if (await Navigator.of(context!).maybePop()) return false;

        if (_controller.index != 0) {
          _controller.index = 0;
          return false;
        }

        return true;
      },
      customWidget: (navBarEssentials) => CustomNavBar(
        items: _navBarsItems(),
        selectedIndex: _controller.index,
        onItemSelected: (index) {
          setState(() {
            _controller.index = index;
          });
        },
      ),
      screenTransitionAnimation: const ScreenTransitionAnimation(
        // Screen transition animation on change of selected tab.
        animateTabTransition: true,
        curve: Curves.ease,
        duration: Duration(milliseconds: 200),
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
        icon: const Icon(Icons.format_list_numbered_rounded),
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
