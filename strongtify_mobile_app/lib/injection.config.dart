// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:get_it/get_it.dart' as _i1;
import 'package:injectable/injectable.dart' as _i2;

import 'common_blocs/albums/albums_bloc.dart' as _i17;
import 'common_blocs/auth/auth_bloc.dart' as _i27;
import 'common_blocs/genres/genres_bloc.dart' as _i5;
import 'common_blocs/playlists/playlists_bloc.dart' as _i10;
import 'common_blocs/songs/songs_bloc.dart' as _i13;
import 'dio/dio_client.dart' as _i3;
import 'dio/interceptors/token_interceptor.dart' as _i14;
import 'services/api/account_service.dart' as _i15;
import 'services/api/album_service.dart' as _i16;
import 'services/api/artist_service.dart' as _i18;
import 'services/api/auth_service.dart' as _i19;
import 'services/api/genre_service.dart' as _i4;
import 'services/api/home_service.dart' as _i6;
import 'services/api/playlist_service.dart' as _i9;
import 'services/api/search_service.dart' as _i11;
import 'services/api/song_service.dart' as _i12;
import 'services/local_storage/local_storage.dart' as _i7;
import 'services/local_storage/local_storage_impl.dart' as _i8;
import 'ui/screens/album_detail/bloc/album_detail_bloc.dart' as _i25;
import 'ui/screens/artist_detail/bloc/artist_detail_bloc.dart' as _i26;
import 'ui/screens/genre_detail/bloc/genre_detail_bloc.dart' as _i20;
import 'ui/screens/home/bloc/home_sections_bloc.dart' as _i21;
import 'ui/screens/playlist_detail/bloc/playlist_detail_bloc.dart' as _i22;
import 'ui/screens/rank/bloc/rank_bloc.dart' as _i23;
import 'ui/screens/search/bloc/search_bloc.dart' as _i24;

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
    gh.factory<_i5.GenresBloc>(() => _i5.GenresBloc(gh<_i4.GenreService>()));
    gh.factory<_i6.HomeService>(() => _i6.HomeService(gh<_i3.DioClient>()));
    gh.factory<_i7.LocalStorage>(() => _i8.LocalStorageImpl());
    gh.factory<_i9.PlaylistService>(
        () => _i9.PlaylistService(gh<_i3.DioClient>()));
    gh.factory<_i10.PlaylistsBloc>(
        () => _i10.PlaylistsBloc(gh<_i9.PlaylistService>()));
    gh.factory<_i11.SearchService>(
        () => _i11.SearchService(gh<_i3.DioClient>()));
    gh.factory<_i12.SongService>(() => _i12.SongService(gh<_i3.DioClient>()));
    gh.factory<_i13.SongsBloc>(() => _i13.SongsBloc(gh<_i12.SongService>()));
    gh.factory<_i14.TokenInterceptor>(
        () => _i14.TokenInterceptor(gh<_i7.LocalStorage>()));
    gh.factory<_i15.AccountService>(
        () => _i15.AccountService(gh<_i3.DioClient>()));
    gh.factory<_i16.AlbumService>(() => _i16.AlbumService(gh<_i3.DioClient>()));
    gh.factory<_i17.AlbumsBloc>(() => _i17.AlbumsBloc(gh<_i16.AlbumService>()));
    gh.factory<_i18.ArtistService>(
        () => _i18.ArtistService(gh<_i3.DioClient>()));
    gh.factory<_i19.AuthService>(() => _i19.AuthService(
          gh<_i3.DioClient>(),
          gh<_i7.LocalStorage>(),
        ));
    gh.factory<_i20.GenreDetailBloc>(
        () => _i20.GenreDetailBloc(gh<_i4.GenreService>()));
    gh.factory<_i21.HomeSectionsBloc>(
        () => _i21.HomeSectionsBloc(gh<_i6.HomeService>()));
    gh.factory<_i22.PlaylistDetailBloc>(
        () => _i22.PlaylistDetailBloc(gh<_i9.PlaylistService>()));
    gh.lazySingleton<_i23.RankBloc>(
        () => _i23.RankBloc(gh<_i12.SongService>()));
    gh.factory<_i24.SearchBloc>(
        () => _i24.SearchBloc(gh<_i11.SearchService>()));
    gh.factory<_i25.AlbumDetailBloc>(
        () => _i25.AlbumDetailBloc(gh<_i16.AlbumService>()));
    gh.factory<_i26.ArtistDetailBloc>(
        () => _i26.ArtistDetailBloc(gh<_i18.ArtistService>()));
    gh.lazySingleton<_i27.AuthBloc>(() => _i27.AuthBloc(
          gh<_i19.AuthService>(),
          gh<_i15.AccountService>(),
          gh<_i7.LocalStorage>(),
        ));
    return this;
  }
}
