// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:get_it/get_it.dart' as _i1;
import 'package:injectable/injectable.dart' as _i2;

import 'blocs/auth/auth_bloc.dart' as _i15;
import 'blocs/genre/genre_bloc.dart' as _i12;
import 'blocs/home_sections/home_sections_bloc.dart' as _i13;
import 'blocs/playlist/playlist_bloc.dart' as _i14;
import 'dio/dio_client.dart' as _i3;
import 'dio/interceptors/token_interceptor.dart' as _i9;
import 'services/api/account_service.dart' as _i10;
import 'services/api/auth_service.dart' as _i11;
import 'services/api/genre_service.dart' as _i4;
import 'services/api/home_service.dart' as _i5;
import 'services/api/playlist_service.dart' as _i8;
import 'services/local_storage/local_storage.dart' as _i6;
import 'services/local_storage/local_storage_impl.dart' as _i7;

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
    gh.factory<_i4.GenreService>(() => _i4.GenreService(gh<_i3.DioClient>()));
    gh.factory<_i5.HomeService>(() => _i5.HomeService(gh<_i3.DioClient>()));
    gh.factory<_i6.LocalStorage>(() => _i7.LocalStorageImpl());
    gh.factory<_i8.PlaylistService>(
        () => _i8.PlaylistService(gh<_i3.DioClient>()));
    gh.factory<_i9.TokenInterceptor>(
        () => _i9.TokenInterceptor(gh<_i6.LocalStorage>()));
    gh.factory<_i10.AccountService>(
        () => _i10.AccountService(gh<_i3.DioClient>()));
    gh.factory<_i11.AuthService>(() => _i11.AuthService(
          gh<_i3.DioClient>(),
          gh<_i6.LocalStorage>(),
        ));
    gh.lazySingleton<_i12.GenreBloc>(
        () => _i12.GenreBloc(gh<_i4.GenreService>()));
    gh.lazySingleton<_i13.HomeSectionsBloc>(
        () => _i13.HomeSectionsBloc(gh<_i5.HomeService>()));
    gh.factory<_i14.PlaylistBloc>(() => _i14.PlaylistBloc(
          gh<_i8.PlaylistService>(),
          gh<_i6.LocalStorage>(),
        ));
    gh.lazySingleton<_i15.AuthBloc>(() => _i15.AuthBloc(
          gh<_i11.AuthService>(),
          gh<_i10.AccountService>(),
          gh<_i6.LocalStorage>(),
        ));
    return this;
  }
}
