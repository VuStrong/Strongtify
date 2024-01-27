import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'bloc.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/services/api/song_service.dart';

@lazySingleton
class RankBloc extends Bloc<RankEvent, RankState> {
  RankBloc(this._songService) : super(RankState.init()) {
    on<GetRankEvent>(_onLoadRank);
  }

  final SongService _songService;

  Future<void> _onLoadRank(GetRankEvent event, Emitter<RankState> emit) async {
    emit(RankState(
      status: RankStatus.loading,
      time: event.time,
      songs: [],
    ));

    List<Song> songs = await _songService.getTopSongs(time: event.time);

    emit(RankState(
      songs: songs,
      time: event.time,
      status: RankStatus.loaded,
    ));
  }
}
