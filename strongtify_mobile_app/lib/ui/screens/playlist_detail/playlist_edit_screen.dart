import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:loader_overlay/loader_overlay.dart';
import 'package:strongtify_mobile_app/ui/screens/playlist_detail/bloc/bloc.dart';
import 'package:strongtify_mobile_app/ui/widgets/text_input.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';
import 'package:strongtify_mobile_app/utils/dialogs/error_dialog.dart';
import 'package:strongtify_mobile_app/utils/enums.dart';

class PlaylistEditScreen extends StatefulWidget {
  const PlaylistEditScreen({
    super.key,
    required this.bloc,
  });

  final PlaylistDetailBloc bloc;

  @override
  State<PlaylistEditScreen> createState() => _PlaylistEditScreenState();
}

class _PlaylistEditScreenState extends State<PlaylistEditScreen> {
  final _formKey = GlobalKey<FormState>();
  final ImagePicker _picker = ImagePicker();

  late final TextEditingController nameController;
  late final TextEditingController descController;

  String? _imagePath;
  File? _pickedImage;
  PlaylistStatus _status = PlaylistStatus.public;
  bool _useNetworkImage = true;

  void disposeControllers() {
    nameController.dispose();
    descController.dispose();
  }

  @override
  void initState() {
    final playlist = widget.bloc.state.playlist!;

    nameController = TextEditingController(text: playlist.name);
    descController = TextEditingController(text: playlist.description);

    _status = playlist.status;
    _imagePath = playlist.imageUrl;

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

  void _onPressSave() {
    if (_formKey.currentState!.validate()) {
      final playlist = widget.bloc.state.playlist!;

      widget.bloc.add(EditPlaylistEvent(
        playlistId: playlist.id,
        name: nameController.text,
        description: descController.text,
        status: _status,
        image: _pickedImage,
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider<PlaylistDetailBloc>.value(
      value: widget.bloc,
      child: Scaffold(
        appBar: AppBar(
          foregroundColor: Colors.white,
          title: const Text(
            'Chỉnh sửa danh sách phát',
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
                _onPressSave();
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
    return BlocListener<PlaylistDetailBloc, PlaylistDetailState>(
      listener: (context, PlaylistDetailState state) async {
        if (state.status == PlaylistDetailStatus.editing) {
          context.loaderOverlay.show();

          return;
        }

        context.loaderOverlay.hide();

        if (state.status == PlaylistDetailStatus.error) {
          await showErrorDialog(
            context: context,
            error: state.errorMessage ?? '',
          );

          return;
        }

        if (state.status == PlaylistDetailStatus.edited) {
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
                    'Thay đổi ảnh',
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
