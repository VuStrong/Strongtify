import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:loader_overlay/loader_overlay.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/ui/screens/settings/change_password/bloc/bloc.dart';
import 'package:strongtify_mobile_app/ui/widgets/button.dart';
import 'package:strongtify_mobile_app/ui/widgets/text_input.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';
import 'package:strongtify_mobile_app/utils/dialogs/error_dialog.dart';
import 'package:strongtify_mobile_app/utils/extensions.dart';

class ChangePasswordScreen extends StatefulWidget {
  const ChangePasswordScreen({super.key});

  static String id = 'change_password_screen';

  @override
  State<ChangePasswordScreen> createState() => _ChangePasswordScreenState();
}

class _ChangePasswordScreenState extends State<ChangePasswordScreen> {
  FToast fToast = FToast();
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController oldPasswordController;
  late final TextEditingController newPasswordController;
  late final TextEditingController confirmPasswordController;

  final ValueNotifier<bool> oldPasswordNotifier = ValueNotifier(true);
  final ValueNotifier<bool> newPasswordNotifier = ValueNotifier(true);
  final ValueNotifier<bool> confirmPasswordNotifier = ValueNotifier(true);

  void disposeControllers() {
    oldPasswordController.dispose();
    newPasswordController.dispose();
    confirmPasswordController.dispose();
  }

  @override
  void initState() {
    oldPasswordController = TextEditingController();
    newPasswordController = TextEditingController();
    confirmPasswordController = TextEditingController();

    super.initState();

    fToast.init(context);
  }

  @override
  void dispose() {
    disposeControllers();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider<ChangePasswordBloc>(
      create: (context) => getIt<ChangePasswordBloc>(),
      child: Scaffold(
        appBar: AppBar(
          foregroundColor: Colors.white,
          title: const Text(
            'Đổi mật khẩu',
            style: TextStyle(color: Colors.white),
          ),
          backgroundColor: ColorConstants.background,
        ),
        body: BlocConsumer<ChangePasswordBloc, ChangePasswordState>(
          listener: (context, ChangePasswordState state) {
            if (state.isChanging) {
              context.loaderOverlay.show();

              return;
            }

            context.loaderOverlay.hide();

            if (state.errorMessage != null) {
              showErrorDialog(context: context, error: state.errorMessage!);

              return;
            }

            if (state.isSuccess) {
              Navigator.pop(context);
              fToast.showSuccessToast(msg: 'Đổi mật khẩu thành công!');
            }
          },
          builder: (context, ChangePasswordState state) {
            return _buildChangePasswordForm(context);
          },
        ),
      ),
    );
  }

  Widget _buildChangePasswordForm(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Form(
        key: _formKey,
        child: Column(
          children: [
            ValueListenableBuilder<bool>(
              valueListenable: oldPasswordNotifier,
              builder: (_, passwordObscure, __) {
                return TextInput(
                  obscureText: passwordObscure,
                  controller: oldPasswordController,
                  labelText: 'Mật khẩu cũ',
                  textInputAction: TextInputAction.next,
                  keyboardType: TextInputType.visiblePassword,
                  validator: (value) {
                    return value!.isEmpty ? 'Hãy nhập mật khẩu cũ' : null;
                  },
                  suffixIcon: Focus(
                    descendantsAreFocusable: false,
                    child: IconButton(
                      onPressed: () =>
                          oldPasswordNotifier.value = !passwordObscure,
                      style: IconButton.styleFrom(
                        minimumSize: const Size.square(48),
                      ),
                      icon: Icon(
                        passwordObscure
                            ? Icons.visibility_off_outlined
                            : Icons.visibility_outlined,
                        color: Colors.white70,
                      ),
                    ),
                  ),
                );
              },
            ),
            ValueListenableBuilder<bool>(
              valueListenable: newPasswordNotifier,
              builder: (_, passwordObscure, __) {
                return TextInput(
                  obscureText: passwordObscure,
                  controller: newPasswordController,
                  labelText: 'Mật khẩu mới',
                  textInputAction: TextInputAction.next,
                  keyboardType: TextInputType.visiblePassword,
                  validator: (value) {
                    return value!.isEmpty
                        ? 'Hãy nhập mật khẩu mới'
                        : value.length >= 8
                            ? null
                            : 'Mật khẩu phải có ít nhất 8 ký tự!';
                  },
                  suffixIcon: Focus(
                    descendantsAreFocusable: false,
                    child: IconButton(
                      onPressed: () =>
                          newPasswordNotifier.value = !passwordObscure,
                      style: IconButton.styleFrom(
                        minimumSize: const Size.square(48),
                      ),
                      icon: Icon(
                        passwordObscure
                            ? Icons.visibility_off_outlined
                            : Icons.visibility_outlined,
                        color: Colors.white70,
                      ),
                    ),
                  ),
                );
              },
            ),
            ValueListenableBuilder(
              valueListenable: confirmPasswordNotifier,
              builder: (_, confirmPasswordObscure, __) {
                return TextInput(
                  labelText: 'Nhập lại mật khẩu',
                  controller: confirmPasswordController,
                  obscureText: confirmPasswordObscure,
                  textInputAction: TextInputAction.done,
                  keyboardType: TextInputType.visiblePassword,
                  validator: (value) {
                    return value!.isEmpty
                        ? 'Hãy nhập lại mật khẩu'
                        : newPasswordController.text ==
                                confirmPasswordController.text
                            ? null
                            : 'Mật khẩu không khớp';
                  },
                  suffixIcon: Focus(
                    descendantsAreFocusable: false,
                    child: IconButton(
                      onPressed: () => confirmPasswordNotifier.value =
                          !confirmPasswordObscure,
                      style: IconButton.styleFrom(
                        minimumSize: const Size.square(48),
                      ),
                      icon: Icon(
                        confirmPasswordObscure
                            ? Icons.visibility_off_outlined
                            : Icons.visibility_outlined,
                        color: Colors.white70,
                      ),
                    ),
                  ),
                );
              },
            ),
            Button(
              onPressed: () {
                if (_formKey.currentState!.validate()) {
                  String oldPassword = oldPasswordController.text;
                  String newPassword = newPasswordController.text;

                  context.read<ChangePasswordBloc>().add(ChangePasswordEvent(
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                  ));
                }
              },
              buttonText: 'Đổi mật khẩu',
            ),
          ],
        ),
      ),
    );
  }
}
