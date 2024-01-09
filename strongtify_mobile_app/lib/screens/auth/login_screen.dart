import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:loader_overlay/loader_overlay.dart';
import 'package:strongtify_mobile_app/blocs/auth/bloc.dart';
import 'package:strongtify_mobile_app/components/button.dart';
import 'package:strongtify_mobile_app/components/text_input.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';
import 'package:strongtify_mobile_app/utils/constants/regex_constants.dart';
import 'package:strongtify_mobile_app/screens/auth/register_screen.dart';
import 'package:strongtify_mobile_app/utils/common_widgets/gradient_background.dart';
import 'package:strongtify_mobile_app/utils/dialogs/error_dialog.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  static String id = 'login_screen';

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();

  final ValueNotifier<bool> passwordNotifier = ValueNotifier(true);

  late final TextEditingController emailController;
  late final TextEditingController passwordController;

  void disposeControllers() {
    emailController.dispose();
    passwordController.dispose();
  }

  @override
  void initState() {
    emailController = TextEditingController();
    passwordController = TextEditingController();

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

          if (state.errorMessage != null) {
            await showErrorDialog(
                context: context, error: state.errorMessage!);
          }
        }
      },
      child: Scaffold(
        backgroundColor: ColorConstants.background,
        body: ListView(
          padding: EdgeInsets.zero,
          children: [
            const GradientBackground(
              children: [
                Text(
                  'Đăng nhập vào Strongtify',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    fontSize: 34,
                    letterSpacing: 0.5,
                  ),
                ),
                SizedBox(height: 6),
              ],
            ),
            Form(
              key: _formKey,
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    TextInput(
                      controller: emailController,
                      labelText: 'Email',
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.next,
                      validator: (value) {
                        return value!.isEmpty
                            ? 'Hãy nhập địa chỉ email'
                            : RegexConstants.emailRegex.hasMatch(value)
                                ? null
                                : 'Email không hợp lệ!';
                      },
                    ),
                    ValueListenableBuilder(
                      valueListenable: passwordNotifier,
                      builder: (_, passwordObscure, __) {
                        return TextInput(
                          obscureText: passwordObscure,
                          controller: passwordController,
                          labelText: 'Mật khẩu',
                          textInputAction: TextInputAction.done,
                          keyboardType: TextInputType.visiblePassword,
                          validator: (value) {
                            return value!.isEmpty ? 'Hãy nhập mật khẩu' : null;
                          },
                          suffixIcon: IconButton(
                            onPressed: () =>
                                passwordNotifier.value = !passwordObscure,
                            style: IconButton.styleFrom(
                              minimumSize: const Size.square(48),
                            ),
                            icon: Icon(
                              passwordObscure
                                  ? Icons.visibility_off_outlined
                                  : Icons.visibility_outlined,
                              size: 20,
                              color: Colors.white70,
                            ),
                          ),
                        );
                      },
                    ),
                    TextButton(
                      onPressed: () {},
                      child: const Text(
                        'Quên mật khẩu?',
                        style: TextStyle(color: ColorConstants.primary),
                      ),
                    ),
                    const SizedBox(height: 20),
                    Button(
                      onPressed: () {
                        if (_formKey.currentState!.validate()) {
                          final email = emailController.text;
                          final password = passwordController.text;

                          context.read<AuthBloc>().add(
                              AuthEventLogin(email: email, password: password));
                        }
                      },
                      buttonText: 'Đăng nhập',
                    ),
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        Expanded(child: Divider(color: Colors.grey.shade200)),
                        const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 20),
                          child: Text('Hoặc đăng nhập với',
                              style: TextStyle(
                                color: Colors.white70,
                                letterSpacing: 0.5,
                              )),
                        ),
                        Expanded(child: Divider(color: Colors.grey.shade200)),
                      ],
                    ),
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {},
                            icon: SvgPicture.asset('assets/vectors/google.svg',
                                width: 14),
                            label: const Text(
                              'Google',
                              style: TextStyle(color: Colors.white70),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  'Chưa có tài khoản?',
                  style: TextStyle(
                    color: Colors.white70,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(width: 4),
                TextButton(
                  onPressed: () {
                    Navigator.pushNamedAndRemoveUntil(
                        context, RegisterScreen.id, (route) => false);
                  },
                  child: const Text(
                    'Đăng ký',
                    style: TextStyle(color: ColorConstants.primary),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
