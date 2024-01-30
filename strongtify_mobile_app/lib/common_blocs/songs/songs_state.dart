import 'package:strongtify_mobile_app/models/song/song.dart';

class SongsState {}

enum LoadSongsStatus {
  loading,
  loadingMore,
  loaded,
}

class LoadSongsState extends SongsState {
  final LoadSongsStatus status;
  final List<Song>? songs;
  final String? genreId;
  final String? artistId;
  final int skip;
  final int take;
  final bool end;
  final String? sort;

  LoadSongsState({
    this.status = LoadSongsStatus.loading,
    this.songs,
    this.genreId,
    this.artistId,
    this.skip = 0,
    this.take = 10,
    this.end = false,
    this.sort,
  });
}
