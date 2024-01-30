import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/common_blocs/playlists/bloc.dart';
import 'package:strongtify_mobile_app/services/api/playlist_service.dart';

@injectable
class PlaylistsBloc extends Bloc<PlaylistsEvent, PlaylistsState> {
  PlaylistsBloc(this._playlistService) : super(LoadPlaylistsState()) {
    on<GetCurrentUserPlaylists>(_onGetCurrentUserPlaylists);
  }

  final PlaylistService _playlistService;

  Future<void> _onGetCurrentUserPlaylists(
    GetCurrentUserPlaylists event,
    Emitter<PlaylistsState> emit,
  ) async {
    emit(LoadPlaylistsState(isLoading: true));

    const storage = FlutterSecureStorage();
    String userId = await storage.read(key: 'user_id') ?? '';

    final playlists = await _playlistService.getPlaylists(
      userId: userId,
      sort: 'createdAt_desc',
    );

    emit(LoadPlaylistsState(playlists: playlists!.items, isLoading: false));
  }
}
