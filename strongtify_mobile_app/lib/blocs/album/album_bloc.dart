import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/blocs/album/bloc.dart';
import 'package:strongtify_mobile_app/models/album/album_detail.dart';
import 'package:strongtify_mobile_app/services/api/album_service.dart';

@injectable
class AlbumBloc extends Bloc<AlbumEvent, AlbumState> {
  AlbumBloc(this._albumService) : super(LoadingAlbumState()) {
    on<GetAlbumByIdEvent>(_onGetAlbumById);
  }

  final AlbumService _albumService;

  Future<void> _onGetAlbumById(GetAlbumByIdEvent event, Emitter<AlbumState> emit) async {
    emit(LoadingAlbumState());

    AlbumDetail? album = await _albumService.getAlbumById(event.id);

    emit(LoadedAlbumByIdState(album: album));
  }
}