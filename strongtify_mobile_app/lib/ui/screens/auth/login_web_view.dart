import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:strongtify_mobile_app/common_blocs/auth/bloc.dart';
import 'package:strongtify_mobile_app/models/account/account.dart';
import 'package:webview_flutter/webview_flutter.dart';

class LoginWebView extends StatefulWidget {
  const LoginWebView({super.key});

  @override
  State<LoginWebView> createState() => _LoginWebViewState();
}

class _LoginWebViewState extends State<LoginWebView> {
  late final WebViewController _controller;

  @override
  void initState() {
    String url = '${dotenv.env['BACKEND_URL']}/v1/auth/google';

    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0x00000000))
      ..setUserAgent(
        Platform.isIOS
            ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15' +
                ' (KHTML, like Gecko) Version/13.0.1 Mobile/15E148 Safari/604.1'
            : 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Mobile Safari/537.36',
      )
      ..addJavaScriptChannel(
        'Print',
        onMessageReceived: (JavaScriptMessage message) {
          final data = jsonDecode(message.message);

          context.read<AuthBloc>().add(AuthEventSaveTokens(
                accessToken: data['access_token'],
                refreshToken: data['refresh_token'],
                account: Account.fromMap(data['user']),
              ));

          Navigator.pop(context);
        },
      )
      ..loadRequest(Uri.parse(url));

    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: WebViewWidget(
        controller: _controller,
      ),
    );
  }
}
