import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/common_blocs/user_recent_playlists/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/services/api/playlist_service.dart';
import 'package:strongtify_mobile_app/ui/screens/playlist_detail/bloc/bloc.dart';

@injectable
class PlaylistDetailBloc
    extends Bloc<PlaylistDetailEvent, PlaylistDetailState> {
  PlaylistDetailBloc(this._playlistService) : super(PlaylistDetailState()) {
    on<GetPlaylistByIdEvent>(_onGetPlaylistById);

    on<EditPlaylistEvent>(_onEditPlaylist);

    on<DeletePlaylistEvent>(_onDeletePlaylist);
  }

  final PlaylistService _playlistService;

  Future<void> _onGetPlaylistById(
    GetPlaylistByIdEvent event,
    Emitter<PlaylistDetailState> emit,
  ) async {
    emit(PlaylistDetailState(status: PlaylistDetailStatus.loading));

    final playlist = await _playlistService.getPlaylistById(event.id);

    emit(PlaylistDetailState(
      playlist: playlist,
      status: PlaylistDetailStatus.loaded,
    ));
  }

  Future<void> _onEditPlaylist(
    EditPlaylistEvent event,
    Emitter<PlaylistDetailState> emit,
  ) async {
    emit(state.copyWith(status: PlaylistDetailStatus.editing));

    try {
      final editedPlaylist = await _playlistService.editPlaylist(
        event.playlistId,
        name: event.name,
        description: event.description,
        status: event.status,
        image: event.image,
      );

      emit(state.copyWith(
        status: PlaylistDetailStatus.edited,
        playlist: () => editedPlaylist,
        errorMessage: () => null,
      ));

      getIt<UserRecentPlaylistsBloc>().add(GetUserRecentPlaylistsEvent());
    } on Exception {
      emit(state.copyWith(
        status: PlaylistDetailStatus.error,
        errorMessage: () => 'Không thể chỉnh sửa playlist!',
      ));
    }
  }

  Future<void> _onDeletePlaylist(
    DeletePlaylistEvent event,
    Emitter<PlaylistDetailState> emit,
  ) async {
    if (state.status == PlaylistDetailStatus.deleting) return;

    emit(state.copyWith(status: PlaylistDetailStatus.deleting));

    try {
      await _playlistService.deletePlaylist(event.playlistId);

      emit(state.copyWith(
        status: PlaylistDetailStatus.deleted,
        errorMessage: () => null,
      ));

      getIt<UserRecentPlaylistsBloc>().add(GetUserRecentPlaylistsEvent());
    } on Exception {
      emit(state.copyWith(
        status: PlaylistDetailStatus.error,
        errorMessage: () => 'Không thể xóa playlist!',
      ));
    }
  }
}
