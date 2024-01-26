import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/models/user/user.dart';

class UserItem extends StatefulWidget {
  const UserItem({super.key, required this.user});

  final User user;

  @override
  State<UserItem> createState() => _UserItemState();
}

class _UserItemState extends State<UserItem> {
  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.grey.shade900,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            width: double.infinity,
            height: 150,
            child: ClipOval(
              child: widget.user.imageUrl != null
                  ? Image.network(
                      widget.user.imageUrl!,
                      fit: BoxFit.cover,
                    )
                  : Image.asset('assets/img/default-avatar.png'),
            ),
          ),
          ListTile(
            title: Text(
              widget.user.name,
              maxLines: 2,
              style: const TextStyle(
                color: Colors.white,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            subtitle: Text(
              '${widget.user.followerCount} theo dõi',
              style: const TextStyle(
                color: Colors.white30,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
