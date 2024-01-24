import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:loader_overlay/loader_overlay.dart';
import 'package:strongtify_mobile_app/blocs/auth/bloc.dart';
import 'package:strongtify_mobile_app/ui/widgets/button.dart';
import 'package:strongtify_mobile_app/ui/widgets/text_input.dart';
import 'package:strongtify_mobile_app/ui/screens/auth/confirm_email_screen.dart';
import 'package:strongtify_mobile_app/utils/constants/color_constants.dart';
import 'package:strongtify_mobile_app/utils/constants/regex_constants.dart';
import 'package:strongtify_mobile_app/ui/screens/auth/login_screen.dart';
import 'package:strongtify_mobile_app/ui/widgets/gradient_background.dart';
import 'package:strongtify_mobile_app/utils/dialogs/error_dialog.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  static String id = 'register_screen';

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController nameController;
  late final TextEditingController emailController;
  late final TextEditingController passwordController;
  late final TextEditingController confirmPasswordController;

  final ValueNotifier<bool> passwordNotifier = ValueNotifier(true);
  final ValueNotifier<bool> confirmPasswordNotifier = ValueNotifier(true);

  void disposeControllers() {
    nameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
  }

  @override
  void initState() {
    nameController = TextEditingController();
    emailController = TextEditingController();
    passwordController = TextEditingController();
    confirmPasswordController = TextEditingController();

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

          if (state.user != null && context.mounted) {
              Navigator.pushNamedAndRemoveUntil(
                  context, ConfirmEmailScreen.id, (route) => false);
          }
        },
        child: Scaffold(
          body: ListView(
            children: [
              const GradientBackground(
                children: [
                  Text('Đăng ký Strongtify',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        fontSize: 34,
                        letterSpacing: 0.5,
                      )),
                  SizedBox(height: 6),
                ],
              ),
              Padding(
                padding: const EdgeInsets.all(20),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      TextInput(
                        autofocus: true,
                        labelText: 'Tên người dùng',
                        keyboardType: TextInputType.name,
                        textInputAction: TextInputAction.next,
                        validator: (value) {
                          return value!.isEmpty
                              ? 'Hãy nhập tên người dùng'
                              : null;
                        },
                        controller: nameController,
                      ),
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
                      ValueListenableBuilder<bool>(
                        valueListenable: passwordNotifier,
                        builder: (_, passwordObscure, __) {
                          return TextInput(
                            obscureText: passwordObscure,
                            controller: passwordController,
                            labelText: 'Mật khẩu',
                            textInputAction: TextInputAction.next,
                            keyboardType: TextInputType.visiblePassword,
                            validator: (value) {
                              return value!.isEmpty
                                  ? 'Hãy nhập mật khẩu'
                                  : value.length >= 8
                                      ? null
                                      : 'Mật khẩu phải có ít nhất 8 ký tự!';
                            },
                            suffixIcon: Focus(
                              /// If false,
                              ///
                              /// disable focus for all of this node's descendants
                              descendantsAreFocusable: false,

                              /// If false,
                              ///
                              /// make this widget's descendants un-traversable.
                              // descendantsAreTraversable: false,
                              child: IconButton(
                                onPressed: () =>
                                    passwordNotifier.value = !passwordObscure,
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
                                  : passwordController.text ==
                                          confirmPasswordController.text
                                      ? null
                                      : 'Mật khẩu không khớp';
                            },
                            suffixIcon: Focus(
                              /// If false,
                              ///
                              /// disable focus for all of this node's descendants.
                              descendantsAreFocusable: false,

                              /// If false,
                              ///
                              /// make this widget's descendants un-traversable.
                              // descendantsAreTraversable: false,
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
                            String name = nameController.text;
                            String email = emailController.text;
                            String password = passwordController.text;

                            context.read<AuthBloc>().add(AuthEventRegister(
                                  name: name,
                                  email: email,
                                  password: password,
                                ));
                          }
                        },
                        buttonText: 'Đăng ký',
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
                              icon: SvgPicture.asset(
                                  'assets/vectors/google.svg',
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
                    'Đã có tài khoản?',
                    style: TextStyle(
                      color: Colors.white70,
                      letterSpacing: 0.5,
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.pushNamedAndRemoveUntil(
                          context, LoginScreen.id, (route) => false);
                    },
                    child: const Text(
                      'Đăng nhập',
                      style: TextStyle(color: ColorConstants.primary),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ));
  }
}
