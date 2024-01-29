import 'package:flutter/material.dart';
import 'package:strongtify_mobile_app/ui/widgets/app_drawer.dart';
import 'package:strongtify_mobile_app/ui/widgets/appbar_account.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';

class CollectionScreen extends StatefulWidget {
  const CollectionScreen({super.key});

  static String id = 'collection_screen';

  @override
  State<CollectionScreen> createState() => _CollectionScreenState();
}

class _CollectionScreenState extends State<CollectionScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Bộ sưu tập',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: ColorConstants.background,
        leading: const AppbarAccount(),
      ),
      drawer: const AppDrawer(),
      body: SingleChildScrollView(
        child: Column(
          children: [
            //
          ],
        ),
      ),
    );
  }
}
