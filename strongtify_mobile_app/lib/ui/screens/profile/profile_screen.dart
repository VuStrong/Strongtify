import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:persistent_bottom_nav_bar/persistent_tab_view.dart';
import 'package:share_plus/share_plus.dart';
import 'package:strongtify_mobile_app/common_blocs/auth/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/get_playlists/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/get_users/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/models/account/account.dart';
import 'package:strongtify_mobile_app/models/user/user_detail.dart';
import 'package:strongtify_mobile_app/ui/screens/playlist_list/playlist_list_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/profile/bloc/bloc.dart';
import 'package:strongtify_mobile_app/ui/screens/profile/profile_edit_screen.dart';
import 'package:strongtify_mobile_app/ui/screens/user_list/user_list_screen.dart';
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
          actions: [
            BlocBuilder<ProfileBloc, ProfileState>(
              builder: (context, ProfileState state) {
                if (state.status == ProfileStatus.loading ||
                    state.user == null) {
                  return const SizedBox();
                }

                return IconButton(
                  icon: const Icon(Icons.more_vert_outlined),
                  onPressed: () {
                    _showProfileMenuBottomSheet(context, state.user!);
                  },
                );
              },
            ),
          ],
        ),
        body: BlocBuilder<ProfileBloc, ProfileState>(
          builder: (context, ProfileState state) {
            if (state.status == ProfileStatus.loading) {
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

            Account account = context.read<AuthBloc>().state.user!;
            return _buildProfileScreen(context.read<ProfileBloc>(), account);
          },
        ),
      ),
    );
  }

  Widget _buildProfileScreen(ProfileBloc bloc, Account currentUser) {
    final state = bloc.state;

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
          Padding(
            padding: state.user!.about != null
                ? const EdgeInsets.only(top: 16, bottom: 16)
                : const EdgeInsets.only(top: 0, bottom: 0),
            child: Text(
              state.user!.about ?? '',
              style: const TextStyle(color: Colors.white54),
            ),
          ),
          state.user!.id == currentUser.id
              ? Button(
                  width: 120,
                  isOutlined: true,
                  buttonText: 'Chỉnh sửa',
                  onPressed: () {
                    PersistentNavBarNavigator.pushNewScreen(
                      context,
                      screen: ProfileEditScreen(profileBloc: bloc),
                      withNavBar: false,
                    );
                  },
                )
              : Button(
                  width: 120,
                  isOutlined: true,
                  buttonText: 'Theo dõi',
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
                      title: 'Playlist',
                      event: GetPlaylistsByParamsEvent(
                        userId: state.user!.id,
                        sort: 'createdAt_desc',
                      ),
                    ),
                  );
                },
                iconColor: Colors.white,
                textColor: Colors.white,
                trailing: const Icon(Icons.arrow_forward_ios),
                contentPadding: const EdgeInsets.only(right: 0, left: 0),
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
                  PersistentNavBarNavigator.pushNewScreen(
                    context,
                    screen: UserListScreen(
                      event: GetFollowersEvent(
                        userId: state.user!.id,
                      ),
                      title: 'Người theo dõi',
                    ),
                  );
                },
                iconColor: Colors.white,
                textColor: Colors.white,
                trailing: const Icon(Icons.arrow_forward_ios),
                contentPadding: const EdgeInsets.only(right: 0, left: 0),
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
                  PersistentNavBarNavigator.pushNewScreen(
                    context,
                    screen: UserListScreen(
                      event: GetFollowingUsersEvent(
                        userId: state.user!.id,
                      ),
                      title: 'Đang theo dõi',
                    ),
                  );
                },
                iconColor: Colors.white,
                textColor: Colors.white,
                trailing: const Icon(Icons.arrow_forward_ios),
                contentPadding: const EdgeInsets.only(right: 0, left: 0),
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

  void _showProfileMenuBottomSheet(BuildContext context, UserDetail user) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.grey[850],
      useRootNavigator: true,
      builder: (context) {
        return Padding(
          padding:
              const EdgeInsets.only(top: 20, bottom: 20, right: 12, left: 12),
          child: Wrap(
            children: [
              ListTile(
                leading: const Icon(Icons.share),
                textColor: Colors.white70,
                iconColor: Colors.white70,
                title: const Text('Chia sẻ hồ sơ'),
                onTap: () async {
                  Navigator.pop(context);

                  final domain = dotenv.env['WEB_CLIENT_URL'] ?? '';

                  Share.share('$domain/users/${user.id}');
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
