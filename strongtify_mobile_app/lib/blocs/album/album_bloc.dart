import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/blocs/album/bloc.dart';
import 'package:strongtify_mobile_app/models/album/album_detail.dart';
import 'package:strongtify_mobile_app/services/api/album_service.dart';

@injectable
class AlbumBloc extends Bloc<AlbumEvent, AlbumState> {
  AlbumBloc(this._albumService) : super(AlbumState()) {
    on<GetAlbumByIdEvent>(_onGetAlbumById);
    on<GetAlbumsEvent>(_onGetAlbums);
    on<GetMoreAlbumsEvent>(_onGetMoreAlbums);
  }

  final AlbumService _albumService;

  Future<void> _onGetAlbumById(GetAlbumByIdEvent event, Emitter<AlbumState> emit) async {
    emit(LoadAlbumByIdState(isLoading: true));

    AlbumDetail? album = await _albumService.getAlbumById(event.id);

    emit(LoadAlbumByIdState(album: album, isLoading: false));
  }

  Future<void> _onGetAlbums(GetAlbumsEvent event, Emitter<AlbumState> emit) async {
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

  Future<void> _onGetMoreAlbums(GetMoreAlbumsEvent event, Emitter<AlbumState> emit) async {
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