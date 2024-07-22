import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/common_blocs/player/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/user_recent_playlists/bloc.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/services/api/playlist_service.dart';
import 'package:strongtify_mobile_app/ui/screens/playlist_detail/bloc/bloc.dart';

@injectable
class PlaylistDetailBloc
    extends Bloc<PlaylistDetailEvent, PlaylistDetailState> {

  final PlayerBloc playerBloc = getIt<PlayerBloc>();

  PlaylistDetailBloc(this._playlistService) : super(PlaylistDetailState()) {
    on<GetPlaylistByIdEvent>(_onGetPlaylistById);

    on<AddSongToPlaylistStateEvent>(_onAddSongToPlaylistState);

    on<RemoveSongFromPlaylistStateEvent>(_onRemoveSongFromPlaylistState);

    on<EditPlaylistEvent>(_onEditPlaylist);

    on<DeletePlaylistEvent>(_onDeletePlaylist);

    on<MoveSongInPlaylistEvent>(_onMoveSong);
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

  Future<void> _onAddSongToPlaylistState(
    AddSongToPlaylistStateEvent event,
    Emitter<PlaylistDetailState> emit,
  ) async {
    state.playlist?.songs?.add(event.song);
    state.playlist!.totalLength += event.song.length;
    state.playlist!.songCount += 1;

    emit(state.copyWith());
  }

  Future<void> _onRemoveSongFromPlaylistState(
    RemoveSongFromPlaylistStateEvent event,
    Emitter<PlaylistDetailState> emit,
  ) async {
    try {
      final matchedSong = state.playlist!.songs!.firstWhere(
        (song) => song.id == event.songId,
      );

      state.playlist?.songs?.removeWhere((song) => song.id == matchedSong.id);
      state.playlist!.totalLength -= matchedSong.length;
      state.playlist!.songCount -= 1;

      emit(state.copyWith());
    } on StateError {
      //
    }
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
        status: PlaylistDetailStatus.editFailed,
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
        status: PlaylistDetailStatus.deleteFailed,
        errorMessage: () => 'Không thể xóa playlist!',
      ));
    }
  }

  Future<void> _onMoveSong(
    MoveSongInPlaylistEvent event,
    Emitter<PlaylistDetailState> emit,
  ) async {
    if (state.playlist == null ||
        state.playlist!.songs == null ||
        state.playlist!.songs!.isEmpty) return;

    int length = state.playlist!.songs!.length;

    if (event.from < 1 ||
        event.from > length ||
        event.to < 1 ||
        event.to > length ||
        event.from == event.to) return;

    final songToMove = state.playlist!.songs![event.from - 1];

    _playlistService.moveSong(
      state.playlist!.id,
      songId: songToMove.id,
      to: event.to,
    );

    final song = state.playlist!.songs!.removeAt(event.from - 1);
    state.playlist!.songs!.insert(event.to - 1, song);

    if (playerBloc.state.playlistId == state.playlist?.id) {
      playerBloc.add(MoveSongInQueueEvent(from: event.from - 1, to: event.to - 1));
    }

    emit(state.copyWith());
  }
}
