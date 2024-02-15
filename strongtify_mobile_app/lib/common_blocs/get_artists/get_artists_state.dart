import 'package:strongtify_mobile_app/models/api_responses/paged_response.dart';
import 'package:strongtify_mobile_app/models/artist/artist.dart';

enum LoadArtistsStatus {
  loading,
  loadingMore,
  loaded,
}

class GetArtistsState {
  final List<Artist>? artists;
  final LoadArtistsStatus status;
  final int skip;
  final int take;
  final bool end;
  final Future<PagedResponse<Artist>> Function(int skip)? loadBySkip;

  GetArtistsState({
    this.artists,
    this.status = LoadArtistsStatus.loaded,
    this.skip = 0,
    this.take = 10,
    this.end = false,
    this.loadBySkip,
  });

  GetArtistsState copyWith({
    LoadArtistsStatus? status,
    List<Artist>? Function()? artists,
    int? skip,
    int? take,
    bool? end,
  }) {
    return GetArtistsState(
      status: status ?? this.status,
      artists: artists != null ? artists() : this.artists,
      skip: skip ?? this.skip,
      take: take ?? this.take,
      end: end ?? this.end,
      loadBySkip: loadBySkip,
    );
  }
}