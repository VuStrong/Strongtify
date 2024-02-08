import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/common_blocs/get_albums/bloc.dart';
import 'package:strongtify_mobile_app/services/api/album_service.dart';
import 'package:strongtify_mobile_app/services/api/me_service.dart';

@injectable
class GetAlbumsBloc extends Bloc<GetAlbumsEvent, GetAlbumsState> {
  final int _albumsPerLoad = 10;

  GetAlbumsBloc(
    this._albumService,
    this._meService,
  ) : super(GetAlbumsState()) {
    on<GetAlbumsByParamsEvent>(_onGetAlbumsByParams);
    on<GetCurrentUserLikedAlbumsEvent>(_onGetCurrentUserLikedAlbums);
    on<GetMoreAlbumsEvent>(_onGetMoreAlbums);
  }

  final AlbumService _albumService;
  final MeService _meService;

  Future<void> _onGetAlbumsByParams(
    GetAlbumsByParamsEvent event,
    Emitter<GetAlbumsState> emit,
  ) async {
    emit(GetAlbumsState(status: LoadAlbumsStatus.loading));

    try {
      final result = await _albumService.getAlbums(
        skip: 0,
        take: _albumsPerLoad,
        genreId: event.genreId,
        artistId: event.artistId,
        sort: event.sort,
      );

      emit(GetAlbumsState(
        status: LoadAlbumsStatus.loaded,
        albums: result.items,
        end: result.end,
        loadBySkip: (int skip) async {
          return await _albumService.getAlbums(
            skip: skip,
            take: _albumsPerLoad,
            genreId: event.genreId,
            artistId: event.artistId,
            sort: event.sort,
          );
        },
      ));
    } on Exception {
      emit(GetAlbumsState(status: LoadAlbumsStatus.loaded));
    }
  }

  Future<void> _onGetCurrentUserLikedAlbums(
    GetCurrentUserLikedAlbumsEvent event,
    Emitter<GetAlbumsState> emit,
  ) async {
    emit(GetAlbumsState(status: LoadAlbumsStatus.loading));

    try {
      final result = await _meService.getLikedAlbums(take: _albumsPerLoad);

      emit(GetAlbumsState(
        status: LoadAlbumsStatus.loaded,
        albums: result.items,
        end: result.end,
        loadBySkip: (int skip) async {
          return await _meService.getLikedAlbums(
            skip: skip,
            take: _albumsPerLoad,
          );
        },
      ));
    } on Exception {
      emit(GetAlbumsState(status: LoadAlbumsStatus.loaded));
    }
  }

  Future<void> _onGetMoreAlbums(
    GetMoreAlbumsEvent event,
    Emitter<GetAlbumsState> emit,
  ) async {
    if (state.loadBySkip == null) return;

    int skipTo = state.skip + _albumsPerLoad;

    emit(state.copyWith(
      status: LoadAlbumsStatus.loadingMore,
    ));

    try {
      final result = await state.loadBySkip!(skipTo);

      state.albums!.addAll(result.items);

      emit(state.copyWith(
        status: LoadAlbumsStatus.loaded,
        skip: skipTo,
        end: result.end,
      ));
    } on Exception {
      emit(state.copyWith(status: LoadAlbumsStatus.loaded));
    }
  }
}
