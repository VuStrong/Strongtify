import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:image_picker/image_picker.dart';
import 'package:loader_overlay/loader_overlay.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/ui/screens/create_playlist/bloc/bloc.dart';
import 'package:strongtify_mobile_app/ui/widgets/button.dart';
import 'package:strongtify_mobile_app/ui/widgets/text_input.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';
import 'package:strongtify_mobile_app/utils/dialogs/error_dialog.dart';
import 'package:strongtify_mobile_app/utils/enums.dart';
import 'package:strongtify_mobile_app/utils/extensions.dart';

class CreatePlaylistScreen extends StatefulWidget {
  const CreatePlaylistScreen({super.key});

  @override
  State<CreatePlaylistScreen> createState() => _CreatePlaylistScreenState();
}

class _CreatePlaylistScreenState extends State<CreatePlaylistScreen> {
  FToast fToast = FToast();
  final _formKey = GlobalKey<FormState>();
  final ImagePicker _picker = ImagePicker();

  late final TextEditingController nameController;
  late final TextEditingController descController;

  String? _imagePath;
  File? _pickedImage;
  PlaylistStatus _status = PlaylistStatus.public;

  void disposeControllers() {
    nameController.dispose();
    descController.dispose();
  }

  @override
  void initState() {
    nameController = TextEditingController();
    descController = TextEditingController();

    super.initState();

    fToast.init(context);
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
      });
    }
  }

  void _onPressCreate(BuildContext context) {
    if (_formKey.currentState!.validate()) {
      context.read<CreatePlaylistBloc>().add(CreatePlaylistEvent(
        name: nameController.text,
        description: descController.text,
        image: _pickedImage,
        status: _status,
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider<CreatePlaylistBloc>(
      create: (context) => getIt<CreatePlaylistBloc>(),
      child: Scaffold(
        appBar: AppBar(
          foregroundColor: Colors.white,
          title: const Text(
            'Tạo danh sách phát',
            style: TextStyle(color: Colors.white),
          ),
          backgroundColor: ColorConstants.background,
          leading: IconButton(
            onPressed: () {
              Navigator.pop(context);
            },
            icon: const Icon(Icons.close),
          ),
        ),
        body: _buildCreateForm(),
      ),
    );
  }

  Widget _buildCreateForm() {
    return BlocConsumer<CreatePlaylistBloc, CreatePlaylistState>(
      listener: (context, CreatePlaylistState state) {
        if (state.status == CreatePlaylistStatus.processing) {
          context.loaderOverlay.show();

          return;
        }

        context.loaderOverlay.hide();

        if (state.status == CreatePlaylistStatus.error &&
            state.errorMessage != null) {
          showErrorDialog(context: context, error: state.errorMessage!);

          return;
        }

        if (state.status == CreatePlaylistStatus.success) {
          Navigator.pop(context);
          fToast.showSuccessToast(msg: 'Đã tạo danh sách phát');
        }
      },
      builder: (context, CreatePlaylistState state) {
        return SingleChildScrollView(
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
                    child: ClipRect(
                      child: _imagePath != null
                          ? Image.file(
                              File(_imagePath!),
                              fit: BoxFit.cover,
                            )
                          : Image.asset('assets/img/default-song-img.png'),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                TextInput(
                  controller: nameController,
                  labelText: 'Tên danh sách phát',
                  keyboardType: TextInputType.text,
                  textInputAction: TextInputAction.next,
                  validator: (value) {
                    return value!.isEmpty ? 'Hãy nhập tên' : null;
                  },
                ),
                TextInput(
                  controller: descController,
                  labelText: 'Thêm mô tả cho danh sách phát',
                  keyboardType: TextInputType.text,
                  textInputAction: TextInputAction.next,
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Riêng tư',
                      style: TextStyle(color: Colors.white),
                    ),
                    Switch(
                      value: _status == PlaylistStatus.private,
                      activeColor: ColorConstants.primary,
                      onChanged: (bool value) {
                        setState(() {
                          _status = value
                              ? PlaylistStatus.private
                              : PlaylistStatus.public;
                        });
                      },
                    )
                  ],
                ),
                const Text(
                  'Nếu bạn để riêng tư, chỉ mình bạn có thể xem playlist.',
                  style: TextStyle(
                    color: Colors.white38,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 22),
                Button(
                  buttonText: 'Tạo',
                  onPressed: () {
                    _onPressCreate(context);
                  },
                ),
              ],
            ),
          ),
        );
      },
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
