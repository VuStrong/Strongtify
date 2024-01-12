// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:get_it/get_it.dart' as _i1;
import 'package:injectable/injectable.dart' as _i2;

import 'blocs/app_bottom_navigation/app_bottom_navigation_bloc.dart' as _i3;
import 'blocs/auth/auth_bloc.dart' as _i12;
import 'blocs/playlist/playlist_bloc.dart' as _i11;
import 'dio/dio_client.dart' as _i4;
import 'dio/interceptors/token_interceptor.dart' as _i8;
import 'services/account_service.dart' as _i9;
import 'services/auth_service.dart' as _i10;
import 'services/local_storage/local_storage.dart' as _i5;
import 'services/local_storage/local_storage_impl.dart' as _i6;
import 'services/playlist_service.dart' as _i7;

extension GetItInjectableX on _i1.GetIt {
// initializes the registration of main-scope dependencies inside of GetIt
  _i1.GetIt init({
    String? environment,
    _i2.EnvironmentFilter? environmentFilter,
  }) {
    final gh = _i2.GetItHelper(
      this,
      environment,
      environmentFilter,
    );
    gh.factory<_i3.AppBottomNavigationBloc>(
        () => _i3.AppBottomNavigationBloc());
    gh.factory<_i4.DioClient>(() => _i4.DioClient());
    gh.factory<_i5.LocalStorage>(() => _i6.LocalStorageImpl());
    gh.factory<_i7.PlaylistService>(
        () => _i7.PlaylistService(gh<_i4.DioClient>()));
    gh.factory<_i8.TokenInterceptor>(
        () => _i8.TokenInterceptor(gh<_i5.LocalStorage>()));
    gh.factory<_i9.AccountService>(
        () => _i9.AccountService(gh<_i4.DioClient>()));
    gh.factory<_i10.AuthService>(() => _i10.AuthService(
          gh<_i4.DioClient>(),
          gh<_i5.LocalStorage>(),
        ));
    gh.factory<_i11.PlaylistBloc>(() => _i11.PlaylistBloc(
          gh<_i7.PlaylistService>(),
          gh<_i5.LocalStorage>(),
        ));
    gh.lazySingleton<_i12.AuthBloc>(() => _i12.AuthBloc(
          gh<_i10.AuthService>(),
          gh<_i9.AccountService>(),
          gh<_i5.LocalStorage>(),
        ));
    return this;
  }
}
