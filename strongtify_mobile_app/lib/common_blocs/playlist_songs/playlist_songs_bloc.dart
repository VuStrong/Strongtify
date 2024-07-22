import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/common_blocs/player/bloc.dart';
import 'package:strongtify_mobile_app/common_blocs/playlist_songs/bloc.dart';
import 'package:strongtify_mobile_app/exceptions/base_exception.dart';
import 'package:strongtify_mobile_app/injection.dart';
import 'package:strongtify_mobile_app/services/api/playlist_service.dart';

@injectable
class PlaylistSongsBloc extends Bloc<PlaylistSongsEvent, PlaylistSongsState> {
  final PlayerBloc playerBloc = getIt<PlayerBloc>();

  PlaylistSongsBloc(
    this._playlistService,
  ) : super(PlaylistSongsState()) {
    on<AddSongToPlaylistEvent>(_onAddSongToPlaylist);

    on<RemoveSongFromPlaylistEvent>(_onRemoveSongFromPlaylist);
  }

  final PlaylistService _playlistService;

  Future<void> _onAddSongToPlaylist(
    AddSongToPlaylistEvent event,
    Emitter<PlaylistSongsState> emit,
  ) async {
    emit(PlaylistSongsState(
      status: PlaylistSongsStatus.adding,
    ));

    try {
      await _playlistService.addSongToPlaylist(event.playlistId, event.song.id);

      if (playerBloc.state.playlistId == event.playlistId) {
        playerBloc.add(AddSongToQueueEvent(song: event.song));
      }

      emit(PlaylistSongsState(
        status: PlaylistSongsStatus.added,
        addedSong: event.song,
      ));
    } on BaseException catch (e) {
      emit(PlaylistSongsState(
        status: PlaylistSongsStatus.error,
        errorMessage: e.message,
      ));
    } on Exception {
      emit(PlaylistSongsState(
        status: PlaylistSongsStatus.error,
        errorMessage: 'Có lỗi xảy ra!',
      ));
    }
  }

  Future<void> _onRemoveSongFromPlaylist(
    RemoveSongFromPlaylistEvent event,
    Emitter<PlaylistSongsState> emit,
  ) async {
    emit(PlaylistSongsState(
      status: PlaylistSongsStatus.removing,
    ));

    try {
      await _playlistService.removeSongFromPlaylist(
        event.playlistId,
        event.songId,
      );

      if (playerBloc.state.playlistId == event.playlistId) {
        playerBloc.add(RemoveSongFromQueueEvent(songId: event.songId));
      }

      emit(PlaylistSongsState(
        status: PlaylistSongsStatus.removed,
        removedSongId: event.songId,
      ));
    } on BaseException catch (e) {
      emit(PlaylistSongsState(
        status: PlaylistSongsStatus.error,
        errorMessage: e.message,
      ));
    } on Exception {
      emit(PlaylistSongsState(
        status: PlaylistSongsStatus.error,
        errorMessage: 'Có lỗi xảy ra!',
      ));
    }
  }
}
