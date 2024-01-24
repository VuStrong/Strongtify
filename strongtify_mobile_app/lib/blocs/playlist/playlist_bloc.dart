import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/blocs/playlist/bloc.dart';
import 'package:strongtify_mobile_app/services/local_storage/local_storage.dart';
import 'package:strongtify_mobile_app/services/api/playlist_service.dart';

@injectable
class PlaylistBloc extends Bloc<PlaylistEvent, PlaylistState> {
  PlaylistBloc(this._playlistService, this._storage) : super(PlaylistState()) {
    on<GetCurrentUserPlaylists>(_onGetCurrentUserPlaylists);
  }

  final PlaylistService _playlistService;
  final LocalStorage _storage;

  Future<void> _onGetCurrentUserPlaylists(
      GetCurrentUserPlaylists event, Emitter<PlaylistState> emit) async {
    String? userId = await _storage.getString('user_id');
    final result = await _playlistService.getPlaylists(userId: userId);

    emit(PlaylistState(playlists: result));
  }
}
