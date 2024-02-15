import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:strongtify_mobile_app/common_blocs/get_users/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/ui/widgets/user/user_grid.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class UserListScreen extends StatefulWidget {
  const UserListScreen({
    super.key,
    this.title = 'Người dùng',
    required this.event,
  });

  final String title;
  final GetUsersEvent event;

  @override
  State<UserListScreen> createState() => _UserListScreenState();
}

class _UserListScreenState extends State<UserListScreen> {
  final RefreshController _refreshController =
      RefreshController(initialRefresh: false);

  @override
  Widget build(BuildContext context) {
    return BlocProvider<GetUsersBloc>(
      create: (context) => getIt<GetUsersBloc>()..add(widget.event),
      child: Scaffold(
        appBar: AppBar(
          foregroundColor: Colors.white,
          backgroundColor: ColorConstants.background,
          title: Text(widget.title),
        ),
        body: BlocConsumer<GetUsersBloc, GetUsersState>(
          listener: (context, GetUsersState state) {
            if (state.status != LoadUsersStatus.loaded) {
              return;
            }

            if (state.end) {
              _refreshController.loadNoData();
            } else {
              _refreshController.loadComplete();
            }
          },
          builder: (context, GetUsersState state) {
            if (state.status == LoadUsersStatus.loading) {
              return const Center(
                child: CircularProgressIndicator(
                  color: ColorConstants.primary,
                ),
              );
            }

            return _buildUserList(context, state);
          },
        ),
      ),
    );
  }

  Widget _buildUserList(BuildContext context, GetUsersState state) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: SmartRefresher(
        enablePullUp: true,
        enablePullDown: false,
        footer: CustomFooter(
          builder: (BuildContext context, LoadStatus? mode) {
            late final Widget body;

            if (mode == LoadStatus.loading) {
              body = const CircularProgressIndicator(
                color: ColorConstants.primary,
              );
            } else {
              body = const SizedBox.shrink();
            }

            return SizedBox(
              height: 55,
              child: Center(child: body),
            );
          },
        ),
        controller: _refreshController,
        onLoading: () {
          context.read<GetUsersBloc>().add(GetMoreUsersEvent());
        },
        child: UserGrid(users: state.users ?? []),
      ),
    );
  }
}
