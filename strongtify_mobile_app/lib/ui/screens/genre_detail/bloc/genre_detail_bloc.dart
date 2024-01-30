import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/services/api/genre_service.dart';
import 'package:strongtify_mobile_app/ui/screens/genre_detail/bloc/bloc.dart';

@injectable
class GenreDetailBloc extends Bloc<GenreDetailEvent, GenreDetailState> {
  GenreDetailBloc(this._genreService) : super(GenreDetailState()) {
    on<GetGenreByIdEvent>(_onGetGenreById);
  }

  final GenreService _genreService;

  Future<void> _onGetGenreById(GetGenreByIdEvent event, Emitter<GenreDetailState> emit) async {
    emit(GenreDetailState(isLoading: true));

    final genre = await _genreService.getGenreById(event.id);

    emit(GenreDetailState(genre: genre, isLoading: false));
  }
}