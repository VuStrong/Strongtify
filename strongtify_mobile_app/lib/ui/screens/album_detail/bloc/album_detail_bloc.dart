import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/services/api/album_service.dart';
import 'package:strongtify_mobile_app/ui/screens/album_detail/bloc/bloc.dart';

@injectable
class AlbumDetailBloc extends Bloc<AlbumDetailEvent, AlbumDetailState> {
  AlbumDetailBloc(this._albumService) : super(AlbumDetailState()) {
    on<GetAlbumByIdEvent>(_onGetAlbumById);
  }

  final AlbumService _albumService;

  Future<void> _onGetAlbumById(GetAlbumByIdEvent event, Emitter<AlbumDetailState> emit) async {
    emit(AlbumDetailState(isLoading: true));

    final album = await _albumService.getAlbumById(event.id);

    emit(AlbumDetailState(album: album, isLoading: false));
  }
}