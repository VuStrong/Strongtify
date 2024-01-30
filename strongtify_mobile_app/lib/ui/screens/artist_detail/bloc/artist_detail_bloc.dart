import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/services/api/artist_service.dart';
import 'package:strongtify_mobile_app/ui/screens/artist_detail/bloc/bloc.dart';

@injectable
class ArtistDetailBloc extends Bloc<ArtistDetailEvent, ArtistDetailState> {
  ArtistDetailBloc(this._artistService) : super(ArtistDetailState()) {
    on<GetArtistByIdEvent>(_onGetArtistById);
  }

  final ArtistService _artistService;

  Future<void> _onGetArtistById(GetArtistByIdEvent event, Emitter<ArtistDetailState> emit) async {
    emit(ArtistDetailState(isLoading: true));

    final artist = await _artistService.getArtistById(event.id);

    emit(ArtistDetailState(artist: artist, isLoading: false));
  }
}