import 'package:strongtify_mobile_app/models/api_responses/paged_response.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';

enum LoadSongsStatus {
  loading,
  loadingMore,
  loaded,
}

class GetSongsState {
  final LoadSongsStatus status;
  final List<Song>? songs;
  final int skip;
  final bool end;
  final Future<PagedResponse<Song>> Function(int skip)? loadBySkip;

  GetSongsState({
    this.status = LoadSongsStatus.loading,
    this.songs,
    this.skip = 0,
    this.end = false,
    this.loadBySkip,
  });

  GetSongsState copyWith({
    LoadSongsStatus? status,
    List<Song>? Function()? songs,
    int? skip,
    bool? end,
  }) {
    return GetSongsState(
      status: status ?? this.status,
      songs: songs != null ? songs() : this.songs,
      skip: skip ?? this.skip,
      end: end ?? this.end,
      loadBySkip: loadBySkip,
    );
  }
}
