import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/common_blocs/user_recent_playlists/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/services/api/playlist_service.dart';
import 'package:strongtify_mobile_app/ui/screens/create_playlist/bloc/bloc.dart';

@injectable
class CreatePlaylistBloc
    extends Bloc<CreatePlaylistEvent, CreatePlaylistState> {
  CreatePlaylistBloc(this._playlistService) : super(CreatePlaylistState()) {
    on<CreatePlaylistEvent>(_onCreatePlaylist);
  }

  final PlaylistService _playlistService;

  Future<void> _onCreatePlaylist(
    CreatePlaylistEvent event,
    Emitter<CreatePlaylistState> emit,
  ) async {
    emit(CreatePlaylistState(status: CreatePlaylistStatus.processing));

    try {
      await _playlistService.createPlaylist(
        name: event.name,
        status: event.status,
        description: event.description,
        image: event.image,
      );

      getIt<UserRecentPlaylistsBloc>().add(GetUserRecentPlaylistsEvent());

      emit(CreatePlaylistState(
        status: CreatePlaylistStatus.success,
      ));
    } on Exception {
      emit(CreatePlaylistState(
        status: CreatePlaylistStatus.error,
        errorMessage: 'Có lỗi xảy ra, hãy thử lại.',
      ));
    }
  }
}
