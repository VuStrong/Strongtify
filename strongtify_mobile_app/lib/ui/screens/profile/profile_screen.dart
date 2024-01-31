import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:persistent_bottom_nav_bar/persistent_tab_view.dart';
import 'package:strongtify_mobile_app/common_blocs/playlists/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/ui/screens/playlist_list/playlist_list_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/profile/bloc/bloc.dart';
import 'package:strongtify_mobile_app/ui/widgets/button.dart';
import 'package:strongtify_mobile_app/ui/widgets/playlist/playlist_list.dart';
import 'package:strongtify_mobile_app/ui/widgets/user/user_grid.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({
    super.key,
    required this.userId,
  });

  final String userId;

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  Widget build(BuildContext context) {
    return BlocProvider<ProfileBloc>(
      create: (context) =>
          getIt<ProfileBloc>()..add(GetProfileByUserIdEvent(id: widget.userId)),
      child: Scaffold(
        appBar: AppBar(
          foregroundColor: Colors.white,
          title: const Text(
            'Hồ sơ',
            style: TextStyle(color: Colors.white),
          ),
          backgroundColor: ColorConstants.background,
        ),
        body: BlocBuilder<ProfileBloc, ProfileState>(
          builder: (context, ProfileState state) {
            if (state.isLoading) {
              return const Center(
                child: CircularProgressIndicator(
                  color: ColorConstants.primary,
                ),
              );
            }

            if (state.user == null) {
              return const Center(
                child: Text(
                  'Không có dữ liệu',
                  style: TextStyle(color: Colors.white70),
                ),
              );
            }

            return _buildProfileScreen(state);
          },
        ),
      ),
    );
  }

  Widget _buildProfileScreen(ProfileState state) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              SizedBox(
                width: 100,
                height: 100,
                child: ClipOval(
                  child: state.user!.imageUrl != null
                      ? Image.network(
                          state.user!.imageUrl!,
                          fit: BoxFit.cover,
                        )
                      : Image.asset('assets/img/default-avatar.png'),
                ),
              ),
              Expanded(
                child: ListTile(
                  title: Text(
                    state.user!.name,
                    style: const TextStyle(
                      color: Colors.white,
                    ),
                  ),
                  subtitle: Text(
                    '${state.user!.followerCount} người theo dõi - ${state.user!.playlistCount} playlist',
                    style: const TextStyle(
                      color: Colors.white54,
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            state.user!.about ?? '',
            style: const TextStyle(color: Colors.white54),
          ),
          const SizedBox(height: 16),
          Button(
            width: 120,
            isOutlined: true,
            buttonText: 'Chỉnh sửa',
            onPressed: () {
              //
            },
          ),
          const SizedBox(height: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ListTile(
                onTap: () {
                  PersistentNavBarNavigator.pushNewScreen(
                    context,
                    screen: PlaylistListScreen(
                      title: 'Playlist của tôi',
                      event: GetCurrentUserPlaylistsEvent(),
                    ),
                  );
                },
                iconColor: Colors.white,
                textColor: Colors.white,
                trailing: const Icon(Icons.arrow_forward_ios),
                title: const Text(
                  'Playlist',
                  style: TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 20,
                  ),
                ),
              ),
              PlaylistList(playlists: state.user!.playlists ?? []),
            ],
          ),
          const SizedBox(height: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ListTile(
                onTap: () {
                  //
                },
                iconColor: Colors.white,
                textColor: Colors.white,
                trailing: const Icon(Icons.arrow_forward_ios),
                title: const Text(
                  'Người theo dõi',
                  style: TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 20,
                  ),
                ),
              ),
              UserGrid(users: state.user!.followers ?? []),
            ],
          ),
          const SizedBox(height: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ListTile(
                onTap: () {
                  //
                },
                iconColor: Colors.white,
                textColor: Colors.white,
                trailing: const Icon(Icons.arrow_forward_ios),
                title: const Text(
                  'Đang theo dõi',
                  style: TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 20,
                  ),
                ),
              ),
              UserGrid(users: state.user!.followings ?? []),
            ],
          ),
        ],
      ),
    );
  }
}
