// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:get_it/get_it.dart' as _i1;
import 'package:injectable/injectable.dart' as _i2;

import 'blocs/auth/auth_bloc.dart' as _i13;
import 'blocs/home_sections/home_sections_bloc.dart' as _i11;
import 'blocs/playlist/playlist_bloc.dart' as _i12;
import 'dio/dio_client.dart' as _i3;
import 'dio/interceptors/token_interceptor.dart' as _i8;
import 'services/api/account_service.dart' as _i9;
import 'services/api/auth_service.dart' as _i10;
import 'services/api/home_service.dart' as _i4;
import 'services/api/playlist_service.dart' as _i7;
import 'services/local_storage/local_storage.dart' as _i5;
import 'services/local_storage/local_storage_impl.dart' as _i6;

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
    gh.factory<_i4.HomeService>(() => _i4.HomeService(gh<_i3.DioClient>()));
    gh.factory<_i5.LocalStorage>(() => _i6.LocalStorageImpl());
    gh.factory<_i7.PlaylistService>(
        () => _i7.PlaylistService(gh<_i3.DioClient>()));
    gh.factory<_i8.TokenInterceptor>(
        () => _i8.TokenInterceptor(gh<_i5.LocalStorage>()));
    gh.factory<_i9.AccountService>(
        () => _i9.AccountService(gh<_i3.DioClient>()));
    gh.factory<_i10.AuthService>(() => _i10.AuthService(
          gh<_i3.DioClient>(),
          gh<_i5.LocalStorage>(),
        ));
    gh.lazySingleton<_i11.HomeSectionsBloc>(
        () => _i11.HomeSectionsBloc(gh<_i4.HomeService>()));
    gh.factory<_i12.PlaylistBloc>(() => _i12.PlaylistBloc(
          gh<_i7.PlaylistService>(),
          gh<_i5.LocalStorage>(),
        ));
    gh.lazySingleton<_i13.AuthBloc>(() => _i13.AuthBloc(
          gh<_i10.AuthService>(),
          gh<_i9.AccountService>(),
          gh<_i5.LocalStorage>(),
        ));
    return this;
  }
}
