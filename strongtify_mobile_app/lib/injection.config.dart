// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:get_it/get_it.dart' as _i1;
import 'package:injectable/injectable.dart' as _i2;

import 'blocs/album/album_bloc.dart' as _i21;
import 'blocs/artist/artist_bloc.dart' as _i22;
import 'blocs/auth/auth_bloc.dart' as _i23;
import 'blocs/genre/genre_bloc.dart' as _i16;
import 'blocs/home_sections/home_sections_bloc.dart' as _i17;
import 'blocs/playlist/playlist_bloc.dart' as _i18;
import 'blocs/rank/rank_bloc.dart' as _i19;
import 'blocs/search/search_bloc.dart' as _i20;
import 'dio/dio_client.dart' as _i3;
import 'dio/interceptors/token_interceptor.dart' as _i11;
import 'services/api/account_service.dart' as _i12;
import 'services/api/album_service.dart' as _i13;
import 'services/api/artist_service.dart' as _i14;
import 'services/api/auth_service.dart' as _i15;
import 'services/api/genre_service.dart' as _i4;
import 'services/api/home_service.dart' as _i5;
import 'services/api/playlist_service.dart' as _i8;
import 'services/api/search_service.dart' as _i9;
import 'services/api/song_service.dart' as _i10;
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
    gh.factory<_i9.SearchService>(() => _i9.SearchService(gh<_i3.DioClient>()));
    gh.factory<_i10.SongService>(() => _i10.SongService(gh<_i3.DioClient>()));
    gh.factory<_i11.TokenInterceptor>(
        () => _i11.TokenInterceptor(gh<_i6.LocalStorage>()));
    gh.factory<_i12.AccountService>(
        () => _i12.AccountService(gh<_i3.DioClient>()));
    gh.factory<_i13.AlbumService>(() => _i13.AlbumService(gh<_i3.DioClient>()));
    gh.factory<_i14.ArtistService>(
        () => _i14.ArtistService(gh<_i3.DioClient>()));
    gh.factory<_i15.AuthService>(() => _i15.AuthService(
          gh<_i3.DioClient>(),
          gh<_i6.LocalStorage>(),
        ));
    gh.factory<_i16.GenreBloc>(() => _i16.GenreBloc(gh<_i4.GenreService>()));
    gh.factory<_i17.HomeSectionsBloc>(
        () => _i17.HomeSectionsBloc(gh<_i5.HomeService>()));
    gh.factory<_i18.PlaylistBloc>(
        () => _i18.PlaylistBloc(gh<_i8.PlaylistService>()));
    gh.lazySingleton<_i19.RankBloc>(
        () => _i19.RankBloc(gh<_i10.SongService>()));
    gh.factory<_i20.SearchBloc>(() => _i20.SearchBloc(gh<_i9.SearchService>()));
    gh.factory<_i21.AlbumBloc>(() => _i21.AlbumBloc(gh<_i13.AlbumService>()));
    gh.factory<_i22.ArtistBloc>(
        () => _i22.ArtistBloc(gh<_i14.ArtistService>()));
    gh.lazySingleton<_i23.AuthBloc>(() => _i23.AuthBloc(
          gh<_i15.AuthService>(),
          gh<_i12.AccountService>(),
          gh<_i6.LocalStorage>(),
        ));
    return this;
  }
}
