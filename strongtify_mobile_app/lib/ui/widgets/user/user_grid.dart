import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/models/user/user.dart';
import 'package:strongtify_mobile_app/ui/widgets/user/user_item.dart';

class UserGrid extends StatefulWidget {
  const UserGrid({super.key, required this.users});

  final List<User> users;

  @override
  State<UserGrid> createState() => _UserGridState();
}

class _UserGridState extends State<UserGrid> {
  @override
  Widget build(BuildContext context) {
    if (widget.users.isEmpty) {
      return const Text(
        'Không có dữ liệu',
        style: TextStyle(color: Colors.white54),
      );
    }

    return GridView.builder(
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisExtent: 270,
        mainAxisSpacing: 10,
        crossAxisSpacing: 10,
      ),
      shrinkWrap: true,
      padding: EdgeInsets.zero,
      itemCount: widget.users.length,
      physics: const NeverScrollableScrollPhysics(),
      itemBuilder: (_, index) => UserItem(user: widget.users[index]),
    );
  }
}
