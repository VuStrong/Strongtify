import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/blocs/playlist/bloc.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist_detail.dart';
import 'package:strongtify_mobile_app/services/api/playlist_service.dart';

@injectable
class PlaylistBloc extends Bloc<PlaylistEvent, PlaylistState> {
  PlaylistBloc(this._playlistService) : super(LoadingPlaylistState()) {
    on<GetPlaylistByIdEvent>(_onGetPlaylistById);
    on<GetCurrentUserPlaylists>(_onGetCurrentUserPlaylists);
  }

  final PlaylistService _playlistService;

  Future<void> _onGetPlaylistById(
    GetPlaylistByIdEvent event,
    Emitter<PlaylistState> emit,
  ) async {
    emit(LoadingPlaylistState());

    PlaylistDetail? playlist = await _playlistService.getPlaylistById(event.id);

    emit(LoadedPlaylistByIdState(playlist: playlist));
  }

  Future<void> _onGetCurrentUserPlaylists(
    GetCurrentUserPlaylists event,
    Emitter<PlaylistState> emit,
  ) async {
    emit(LoadingPlaylistState());

    const storage = FlutterSecureStorage();
    String userId = await storage.read(key: 'user_id') ?? '';

    final playlists = await _playlistService.getPlaylists(
      userId: userId,
      sort: 'createdAt_desc',
    );

    emit(LoadedPlaylists(playlists: playlists!.items));
  }
}
