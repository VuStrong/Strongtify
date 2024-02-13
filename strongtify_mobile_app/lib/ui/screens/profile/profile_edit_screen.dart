import 'dart:io';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:loader_overlay/loader_overlay.dart';
import 'package:strongtify_mobile_app/ui/screens/profile/bloc/bloc.dart';
import 'package:strongtify_mobile_app/ui/widgets/text_input.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';
import 'package:strongtify_mobile_app/utils/dialogs/error_dialog.dart';

class ProfileEditScreen extends StatefulWidget {
  const ProfileEditScreen({
    super.key,
    required this.profileBloc,
  });

  final ProfileBloc profileBloc;

  @override
  State<ProfileEditScreen> createState() => _ProfileEditScreenState();
}

class _ProfileEditScreenState extends State<ProfileEditScreen> {
  final _formKey = GlobalKey<FormState>();
  final ImagePicker _picker = ImagePicker();

  late final TextEditingController nameController;
  late final TextEditingController aboutController;

  String? _imagePath;
  File? _pickedImage;
  bool _useNetworkImage = true;

  void disposeControllers() {
    nameController.dispose();
    aboutController.dispose();
  }

  @override
  void initState() {
    final user = widget.profileBloc.state.user!;

    nameController = TextEditingController(text: user.name);
    aboutController = TextEditingController(text: user.about);

    _imagePath = user.imageUrl;

    super.initState();
  }

  @override
  void dispose() {
    disposeControllers();
    super.dispose();
  }

  Future<void> _onSelectImageSource(ImageSource source) async {
    final XFile? pickedImage = await _picker.pickImage(
      source: source,
      maxHeight: 500,
      maxWidth: 500,
    );

    if (pickedImage != null) {
      setState(() {
        _imagePath = pickedImage.path;
        _pickedImage = File(pickedImage.path);
        _useNetworkImage = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider<ProfileBloc>.value(
      value: widget.profileBloc,
      child: Scaffold(
        appBar: AppBar(
          foregroundColor: Colors.white,
          title: const Text(
            'Chỉnh sửa hồ sơ',
            style: TextStyle(color: Colors.white),
          ),
          backgroundColor: ColorConstants.background,
          leading: IconButton(
            onPressed: () {
              Navigator.pop(context);
            },
            icon: const Icon(Icons.close),
          ),
          actions: [
            TextButton(
              onPressed: () {
                if (_formKey.currentState!.validate()) {
                  final name = nameController.text;
                  final about = aboutController.text;

                  widget.profileBloc.add(EditProfileEvent(
                    name: name,
                    about: about,
                    image: _pickedImage,
                  ));
                }
              },
              child: const Text(
                'Lưu',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ],
        ),
        body: _buildEditForm(context),
      ),
    );
  }

  Widget _buildEditForm(BuildContext context) {
    final user = widget.profileBloc.state.user!;

    return BlocListener<ProfileBloc, ProfileState>(
      listener: (context, ProfileState state) async {
        if (state.status == ProfileStatus.editing) {
          context.loaderOverlay.show();

          return;
        }

        context.loaderOverlay.hide();

        if (state.status == ProfileStatus.error) {
          await showErrorDialog(
            context: context,
            error: state.errorMessage ?? '',
          );

          return;
        }

        if (state.status == ProfileStatus.edited) {
          Navigator.pop(context);
        }
      },
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              GestureDetector(
                onTap: () {
                  _showSelectImageSourceBottomSheet(context);
                },
                child: SizedBox(
                  width: 150,
                  height: 150,
                  child: ClipOval(
                    child: _imagePath != null
                        ? _useNetworkImage
                            ? Image.network(
                                _imagePath!,
                                fit: BoxFit.cover,
                              )
                            : Image.file(
                                File(_imagePath!),
                                fit: BoxFit.cover,
                              )
                        : Image.asset('assets/img/default-avatar.png'),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              TextInput(
                controller: nameController,
                labelText: 'Tên',
                keyboardType: TextInputType.text,
                textInputAction: TextInputAction.next,
                validator: (value) {
                  return value!.isEmpty ? 'Hãy nhập tên' : null;
                },
              ),
              TextInput(
                controller: aboutController,
                labelText: 'About',
                keyboardType: TextInputType.text,
                textInputAction: TextInputAction.next,
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showSelectImageSourceBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.grey[850],
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.only(top: 20, bottom: 20),
          child: Wrap(
            children: [
              const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Thay đổi avatar',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 20,
                    ),
                  ),
                ],
              ),
              ListTile(
                leading: const Icon(Icons.collections),
                textColor: Colors.white70,
                iconColor: Colors.white70,
                title: const Text('Chọn ảnh từ thiết bị'),
                onTap: () async {
                  Navigator.pop(context);

                  await _onSelectImageSource(ImageSource.gallery);
                },
              ),
              ListTile(
                leading: const Icon(Icons.camera_alt),
                textColor: Colors.white70,
                iconColor: Colors.white70,
                title: const Text('Chụp ảnh'),
                onTap: () async {
                  Navigator.pop(context);

                  await _onSelectImageSource(ImageSource.camera);
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
