import 'package:strongtify_mobile_app/models/api_responses/paged_response.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist.dart';

enum LoadPlaylistsStatus {
  loading,
  loadingMore,
  loaded,
}

class GetPlaylistsState {
  final List<Playlist>? playlists;
  final LoadPlaylistsStatus status;
  final int skip;
  final int take;
  final bool end;
  final Future<PagedResponse<Playlist>> Function(int skip)? loadBySkip;

  GetPlaylistsState({
    this.playlists,
    this.status = LoadPlaylistsStatus.loaded,
    this.skip = 0,
    this.take = 10,
    this.end = false,
    this.loadBySkip,
  });

  GetPlaylistsState copyWith({
    LoadPlaylistsStatus? status,
    List<Playlist>? Function()? playlists,
    int? skip,
    int? take,
    bool? end,
  }) {
    return GetPlaylistsState(
      status: status ?? this.status,
      playlists: playlists != null ? playlists() : this.playlists,
      skip: skip ?? this.skip,
      take: take ?? this.take,
      end: end ?? this.end,
      loadBySkip: loadBySkip,
    );
  }
}
