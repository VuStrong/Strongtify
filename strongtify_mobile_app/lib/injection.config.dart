// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:get_it/get_it.dart' as _i1;
import 'package:injectable/injectable.dart' as _i2;

import 'blocs/auth/auth_bloc.dart' as _i11;
import 'blocs/playlist/playlist_bloc.dart' as _i10;
import 'dio/dio_client.dart' as _i3;
import 'dio/interceptors/token_interceptor.dart' as _i7;
import 'services/account_service.dart' as _i8;
import 'services/auth_service.dart' as _i9;
import 'services/local_storage/local_storage.dart' as _i4;
import 'services/local_storage/local_storage_impl.dart' as _i5;
import 'services/playlist_service.dart' as _i6;

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
    gh.factory<_i3.DioClient>(() => _i3.DioClient());
    gh.factory<_i4.LocalStorage>(() => _i5.LocalStorageImpl());
    gh.factory<_i6.PlaylistService>(
        () => _i6.PlaylistService(gh<_i3.DioClient>()));
    gh.factory<_i7.TokenInterceptor>(
        () => _i7.TokenInterceptor(gh<_i4.LocalStorage>()));
    gh.factory<_i8.AccountService>(
        () => _i8.AccountService(gh<_i3.DioClient>()));
    gh.factory<_i9.AuthService>(() => _i9.AuthService(
          gh<_i3.DioClient>(),
          gh<_i4.LocalStorage>(),
        ));
    gh.factory<_i10.PlaylistBloc>(() => _i10.PlaylistBloc(
          gh<_i6.PlaylistService>(),
          gh<_i4.LocalStorage>(),
        ));
    gh.lazySingleton<_i11.AuthBloc>(() => _i11.AuthBloc(
          gh<_i9.AuthService>(),
          gh<_i8.AccountService>(),
          gh<_i4.LocalStorage>(),
        ));
    return this;
  }
}
