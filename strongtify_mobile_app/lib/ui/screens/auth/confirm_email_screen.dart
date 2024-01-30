import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:loader_overlay/loader_overlay.dart';
import 'package:strongtify_mobile_app/common_blocs/auth/bloc.dart';
import 'package:strongtify_mobile_app/ui/widgets/button.dart';
import 'package:strongtify_mobile_app/ui/screens/auth/login_screen.dart';
import 'package:strongtify_mobile_app/ui/widgets/gradient_background.dart';
import 'package:strongtify_mobile_app/utils/dialogs/success_dialog.dart';

class ConfirmEmailScreen extends StatefulWidget {
  const ConfirmEmailScreen({super.key});

  static String id = 'confirm_email_screen';

  @override
  State<ConfirmEmailScreen> createState() => _ConfirmEmailScreenState();
}

class _ConfirmEmailScreenState extends State<ConfirmEmailScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView(
        padding: EdgeInsets.zero,
        children: [
          const GradientBackground(
            children: [
              Text(
                'Xác thực email',
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
          const Padding(
            padding: EdgeInsets.all(15),
            child: Text(
              'Chúng tôi đã gửi cho bạn một email để xác thực tài khoản, hãy kiểm tra hòm thư.',
              style: TextStyle(color: Colors.white70),
              textAlign: TextAlign.center,
            ),
          ),
          BlocConsumer<AuthBloc, AuthState>(
            listener: (BuildContext context, AuthState state) async {
              if (state.isLoading) {
                context.loaderOverlay.show();
              } else {
                context.loaderOverlay.hide();

                if (state.sendCodeSuccessful) {
                  await showSuccessDialog(
                      context: context, text: 'Gửi mã xác thực thành công!');
                }
              }

              if (state.user == null && context.mounted) {
                Navigator.pushNamedAndRemoveUntil(
                    context, LoginScreen.id, (route) => false);
              }
            },
            builder: (BuildContext context, AuthState state) {
              return Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(8),
                    child: Button(
                      buttonText: 'Gửi lại mã xác thực',
                      onPressed: () {
                        context
                            .read<AuthBloc>()
                            .add(AuthEventSendEmailConfirmation());
                      },
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8),
                    child: Button(
                      buttonText: 'Đăng xuất',
                      isOutlined: true,
                      onPressed: () {
                        context.read<AuthBloc>().add(AuthEventLogout());
                      },
                    ),
                  ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}
