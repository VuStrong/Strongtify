// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:get_it/get_it.dart' as _i1;
import 'package:injectable/injectable.dart' as _i2;

import 'common_blocs/auth/auth_bloc.dart' as _i37;
import 'common_blocs/get_albums/get_albums_bloc.dart' as _i24;
import 'common_blocs/get_artists/get_artists_bloc.dart' as _i25;
import 'common_blocs/get_genres/get_genres_bloc.dart' as _i5;
import 'common_blocs/get_playlists/get_playlists_bloc.dart' as _i26;
import 'common_blocs/get_songs/get_songs_bloc.dart' as _i27;
import 'common_blocs/get_users/get_users_bloc.dart' as _i28;
import 'common_blocs/player/player_bloc.dart' as _i30;
import 'common_blocs/playlist_songs/playlist_songs_bloc.dart' as _i11;
import 'common_blocs/user_favs/user_favs_bloc.dart' as _i15;
import 'common_blocs/user_recent_playlists/user_recent_playlists_bloc.dart'
    as _i16;
import 'dio/dio_client.dart' as _i3;
import 'dio/interceptors/token_interceptor.dart' as _i14;
import 'services/api/album_service.dart' as _i18;
import 'services/api/artist_service.dart' as _i19;
import 'services/api/auth_service.dart' as _i20;
import 'services/api/genre_service.dart' as _i4;
import 'services/api/home_service.dart' as _i6;
import 'services/api/me_service.dart' as _i9;
import 'services/api/playlist_service.dart' as _i10;
import 'services/api/search_service.dart' as _i12;
import 'services/api/song_service.dart' as _i13;
import 'services/api/user_service.dart' as _i17;
import 'services/local_storage/local_storage.dart' as _i7;
import 'services/local_storage/local_storage_impl.dart' as _i8;
import 'ui/screens/album_detail/bloc/album_detail_bloc.dart' as _i35;
import 'ui/screens/artist_detail/bloc/artist_detail_bloc.dart' as _i36;
import 'ui/screens/create_playlist/bloc/create_playlist_bloc.dart' as _i22;
import 'ui/screens/genre_detail/bloc/genre_detail_bloc.dart' as _i23;
import 'ui/screens/home/bloc/home_sections_bloc.dart' as _i29;
import 'ui/screens/playlist_detail/bloc/playlist_detail_bloc.dart' as _i31;
import 'ui/screens/profile/bloc/profile_bloc.dart' as _i32;
import 'ui/screens/rank/bloc/rank_bloc.dart' as _i33;
import 'ui/screens/search/bloc/search_bloc.dart' as _i34;
import 'ui/screens/settings/change_password/bloc/change_password_bloc.dart'
    as _i21;

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
    gh.factory<_i5.GetGenresBloc>(
        () => _i5.GetGenresBloc(gh<_i4.GenreService>()));
    gh.factory<_i6.HomeService>(() => _i6.HomeService(gh<_i3.DioClient>()));
    gh.factory<_i7.LocalStorage>(() => _i8.LocalStorageImpl());
    gh.factory<_i9.MeService>(() => _i9.MeService(
          gh<_i3.DioClient>(),
          gh<_i7.LocalStorage>(),
        ));
    gh.factory<_i10.PlaylistService>(
        () => _i10.PlaylistService(gh<_i3.DioClient>()));
    gh.factory<_i11.PlaylistSongsBloc>(
        () => _i11.PlaylistSongsBloc(gh<_i10.PlaylistService>()));
    gh.factory<_i12.SearchService>(
        () => _i12.SearchService(gh<_i3.DioClient>()));
    gh.factory<_i13.SongService>(() => _i13.SongService(gh<_i3.DioClient>()));
    gh.factory<_i14.TokenInterceptor>(
        () => _i14.TokenInterceptor(gh<_i7.LocalStorage>()));
    gh.singleton<_i15.UserFavsBloc>(_i15.UserFavsBloc(gh<_i9.MeService>()));
    gh.singleton<_i16.UserRecentPlaylistsBloc>(_i16.UserRecentPlaylistsBloc(
      gh<_i10.PlaylistService>(),
      gh<_i7.LocalStorage>(),
    ));
    gh.factory<_i17.UserService>(() => _i17.UserService(gh<_i3.DioClient>()));
    gh.factory<_i18.AlbumService>(() => _i18.AlbumService(gh<_i3.DioClient>()));
    gh.factory<_i19.ArtistService>(
        () => _i19.ArtistService(gh<_i3.DioClient>()));
    gh.factory<_i20.AuthService>(() => _i20.AuthService(
          gh<_i3.DioClient>(),
          gh<_i7.LocalStorage>(),
        ));
    gh.factory<_i21.ChangePasswordBloc>(
        () => _i21.ChangePasswordBloc(gh<_i9.MeService>()));
    gh.factory<_i22.CreatePlaylistBloc>(
        () => _i22.CreatePlaylistBloc(gh<_i10.PlaylistService>()));
    gh.factory<_i23.GenreDetailBloc>(
        () => _i23.GenreDetailBloc(gh<_i4.GenreService>()));
    gh.factory<_i24.GetAlbumsBloc>(() => _i24.GetAlbumsBloc(
          gh<_i18.AlbumService>(),
          gh<_i9.MeService>(),
        ));
    gh.factory<_i25.GetArtistsBloc>(
        () => _i25.GetArtistsBloc(gh<_i17.UserService>()));
    gh.factory<_i26.GetPlaylistsBloc>(() => _i26.GetPlaylistsBloc(
          gh<_i10.PlaylistService>(),
          gh<_i9.MeService>(),
          gh<_i7.LocalStorage>(),
        ));
    gh.factory<_i27.GetSongsBloc>(() => _i27.GetSongsBloc(
          gh<_i13.SongService>(),
          gh<_i9.MeService>(),
        ));
    gh.factory<_i28.GetUsersBloc>(
        () => _i28.GetUsersBloc(gh<_i17.UserService>()));
    gh.factory<_i29.HomeSectionsBloc>(
        () => _i29.HomeSectionsBloc(gh<_i6.HomeService>()));
    gh.singleton<_i30.PlayerBloc>(_i30.PlayerBloc(gh<_i13.SongService>()));
    gh.factory<_i31.PlaylistDetailBloc>(
        () => _i31.PlaylistDetailBloc(gh<_i10.PlaylistService>()));
    gh.factory<_i32.ProfileBloc>(() => _i32.ProfileBloc(
          gh<_i17.UserService>(),
          gh<_i9.MeService>(),
        ));
    gh.lazySingleton<_i33.RankBloc>(
        () => _i33.RankBloc(gh<_i13.SongService>()));
    gh.factory<_i34.SearchBloc>(
        () => _i34.SearchBloc(gh<_i12.SearchService>()));
    gh.factory<_i35.AlbumDetailBloc>(
        () => _i35.AlbumDetailBloc(gh<_i18.AlbumService>()));
    gh.factory<_i36.ArtistDetailBloc>(
        () => _i36.ArtistDetailBloc(gh<_i19.ArtistService>()));
    gh.lazySingleton<_i37.AuthBloc>(() => _i37.AuthBloc(
          gh<_i20.AuthService>(),
          gh<_i9.MeService>(),
          gh<_i7.LocalStorage>(),
        ));
    return this;
  }
}
