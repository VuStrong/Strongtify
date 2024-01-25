import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/blocs/rank/bloc.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/services/api/song_service.dart';

@lazySingleton
class RankBloc extends Bloc<RankEvent, RankState> {
  RankBloc(this._songService) : super(LoadingRankState()) {
    on<GetRankEvent>(_onLoadRank);
  }

  final SongService _songService;

  Future<void> _onLoadRank(GetRankEvent event, Emitter<RankState> emit) async {
    emit(LoadingRankState());

    List<Song> songs = await _songService.getTopSongs(time: event.time);

    emit(LoadedRankState(songs: songs, time: event.time));
  }
}
