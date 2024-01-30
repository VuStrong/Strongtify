import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/services/api/playlist_service.dart';
import 'package:strongtify_mobile_app/ui/screens/playlist_detail/bloc/bloc.dart';

@injectable
class PlaylistDetailBloc extends Bloc<PlaylistDetailEvent, PlaylistDetailState> {
  PlaylistDetailBloc(this._playlistService) : super(PlaylistDetailState()) {
    on<GetPlaylistByIdEvent>(_onGetPlaylistById);
  }

  final PlaylistService _playlistService;

  Future<void> _onGetPlaylistById(
    GetPlaylistByIdEvent event,
    Emitter<PlaylistDetailState> emit,
  ) async {
    emit(PlaylistDetailState(isLoading: true));

    final playlist = await _playlistService.getPlaylistById(event.id);

    emit(PlaylistDetailState(playlist: playlist, isLoading: false));
  }
}
