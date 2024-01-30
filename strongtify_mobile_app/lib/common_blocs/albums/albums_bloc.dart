import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/common_blocs/albums/bloc.dart';
import 'package:strongtify_mobile_app/services/api/album_service.dart';

@injectable
class AlbumsBloc extends Bloc<AlbumsEvent, AlbumsState> {
  AlbumsBloc(this._albumService) : super(AlbumsState()) {
    on<GetAlbumsEvent>(_onGetAlbums);
    on<GetMoreAlbumsEvent>(_onGetMoreAlbums);
  }

  final AlbumService _albumService;

  Future<void> _onGetAlbums(GetAlbumsEvent event, Emitter<AlbumsState> emit) async {
    emit(LoadAlbumsState(status: LoadAlbumsStatus.loading));

    try {
      final result = await _albumService.getAlbums(
        skip: 0,
        take: 10,
        genreId: event.genreId,
        artistId: event.artistId,
        sort: event.sort,
      );

      emit(LoadAlbumsState(
        status: LoadAlbumsStatus.loaded,
        albums: result.items,
        genreId: event.genreId,
        artistId: event.artistId,
        take: 10,
        end: result.end,
        sort: event.sort,
      ));
    } on Exception {
      emit(LoadAlbumsState(status: LoadAlbumsStatus.loaded));
    }
  }

  Future<void> _onGetMoreAlbums(GetMoreAlbumsEvent event, Emitter<AlbumsState> emit) async {
    final currentState = state as LoadAlbumsState;
    int skipTo = currentState.skip + currentState.take;

    emit(LoadAlbumsState(
      status: LoadAlbumsStatus.loadingMore,
      albums: currentState.albums,
    ));

    try {
      final result = await _albumService.getAlbums(
        skip: skipTo,
        take: currentState.take,
        genreId: currentState.genreId,
        artistId: currentState.artistId,
        sort: currentState.sort,
      );

      currentState.albums!.addAll(result.items);

      emit(LoadAlbumsState(
        status: LoadAlbumsStatus.loaded,
        albums: currentState.albums,
        skip: skipTo,
        take: currentState.take,
        genreId: currentState.genreId,
        artistId: currentState.artistId,
        end: result.end,
        sort: currentState.sort,
      ));
    } on Exception {
      emit(LoadAlbumsState(
        status: LoadAlbumsStatus.loaded
      ));
    }
  }
}