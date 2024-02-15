import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/common_blocs/user_recent_playlists/bloc.dart';
import 'package:strongtify_mobile_app/services/api/playlist_service.dart';
import 'package:strongtify_mobile_app/services/local_storage/local_storage.dart';

@singleton
class UserRecentPlaylistsBloc
    extends Bloc<UserRecentPlaylistsEvent, UserRecentPlaylistsState> {
  UserRecentPlaylistsBloc(
    this._playlistService,
    this._storage,
  ) : super(UserRecentPlaylistsState()) {
    on<GetUserRecentPlaylistsEvent>(_onGetUserRecentPlaylists);
  }

  final PlaylistService _playlistService;
  final LocalStorage _storage;

  Future<void> _onGetUserRecentPlaylists(
    GetUserRecentPlaylistsEvent event,
    Emitter<UserRecentPlaylistsState> emit,
  ) async {
    emit(UserRecentPlaylistsState(isLoading: true));

    final userId = await _storage.getString('user_id');

    try {
      final result = await _playlistService.getPlaylists(
        take: 5,
        sort: 'createdAt_desc',
        userId: userId,
      );

      emit(UserRecentPlaylistsState(
        isLoading: false,
        playlists: result.items,
      ));
    } on Exception {
      emit(UserRecentPlaylistsState(isLoading: false));
    }
  }
}
