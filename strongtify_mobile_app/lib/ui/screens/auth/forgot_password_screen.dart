import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:loader_overlay/loader_overlay.dart';
import 'package:strongtify_mobile_app/blocs/auth/bloc.dart';
import 'package:strongtify_mobile_app/ui/widgets/button.dart';
import 'package:strongtify_mobile_app/ui/widgets/text_input.dart';
import 'package:strongtify_mobile_app/utils/constants/regex_constants.dart';
import 'package:strongtify_mobile_app/ui/widgets/gradient_background.dart';
import 'package:strongtify_mobile_app/utils/dialogs/error_dialog.dart';
import 'package:strongtify_mobile_app/utils/dialogs/success_dialog.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  static String id = 'forgot_password_screen';

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController emailController;

  void disposeControllers() {
    emailController.dispose();
  }

  @override
  void initState() {
    emailController = TextEditingController();

    super.initState();
  }

  @override
  void dispose() {
    disposeControllers();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listener: (context, state) async {
        if (state.isLoading) {
          context.loaderOverlay.show();
        } else {
          context.loaderOverlay.hide();

          if (state.resetPasswordErrorMessage != null) {
            await showErrorDialog(
                context: context, error: state.resetPasswordErrorMessage!);
          }

          if (state.sendCodeSuccessful && context.mounted) {
            await showSuccessDialog(
              context: context,
              text:
                  'Gửi mã xác thực thành công!, hãy kiểm tra hòm thư của bạn.',
            );
          }
        }
      },
      child: Scaffold(
        body: ListView(
          children: [
            const GradientBackground(
              children: [
                Text('Quên mật khẩu',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      fontSize: 34,
                      letterSpacing: 0.5,
                    )),
                SizedBox(height: 6),
              ],
            ),
            const Padding(
              padding: EdgeInsets.all(20),
              child: Text(
                'Hãy nhập địa chỉ email mà bạn đã dùng để đăng ký. '
                'Chúng tôi sẽ gửi email cho bạn cùng đường liên kết để đặt lại mật khẩu.',
                style: TextStyle(color: Colors.white70),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    TextInput(
                      labelText: 'Email',
                      controller: emailController,
                      textInputAction: TextInputAction.next,
                      keyboardType: TextInputType.emailAddress,
                      validator: (value) {
                        return value!.isEmpty
                            ? 'Hãy nhập địa chỉ email'
                            : RegexConstants.emailRegex.hasMatch(value)
                                ? null
                                : 'Địa chỉ email không phù hợp!';
                      },
                    ),
                    Button(
                      onPressed: () {
                        if (_formKey.currentState!.validate()) {
                          String email = emailController.text;

                          context
                              .read<AuthBloc>()
                              .add(AuthEventSendPasswordResetLink(
                                email: email,
                              ));
                        }
                      },
                      buttonText: 'Gửi mã xác thực',
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
