import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/blocs/artist/bloc.dart';
import 'package:strongtify_mobile_app/models/artist/artist_detail.dart';
import 'package:strongtify_mobile_app/services/api/artist_service.dart';

@injectable
class ArtistBloc extends Bloc<ArtistEvent, ArtistState> {
  ArtistBloc(this._artistService) : super(LoadingArtistState()) {
    on<GetArtistByIdEvent>(_onGetArtistById);
  }

  final ArtistService _artistService;

  Future<void> _onGetArtistById(GetArtistByIdEvent event, Emitter<ArtistState> emit) async {
    emit(LoadingArtistState());

    ArtistDetail? artist = await _artistService.getArtistById(event.id);

    emit(LoadedArtistByIdState(artist: artist));
  }
}