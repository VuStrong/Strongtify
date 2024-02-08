import 'package:strongtify_mobile_app/models/album/album.dart';
import 'package:strongtify_mobile_app/models/api_responses/paged_response.dart';

enum LoadAlbumsStatus {
  loading,
  loadingMore,
  loaded,
}

class GetAlbumsState {
  final LoadAlbumsStatus status;
  final List<Album>? albums;
  final int skip;
  final bool end;
  final Future<PagedResponse<Album>> Function(int skip)? loadBySkip;

  GetAlbumsState({
    this.status = LoadAlbumsStatus.loading,
    this.albums,
    this.skip = 0,
    this.end = false,
    this.loadBySkip,
  });

  GetAlbumsState copyWith({
    LoadAlbumsStatus? status,
    List<Album>? Function()? albums,
    int? skip,
    bool? end,
  }) {
    return GetAlbumsState(
      status: status ?? this.status,
      albums: albums != null ? albums() : this.albums,
      skip: skip ?? this.skip,
      end: end ?? this.end,
      loadBySkip: loadBySkip,
    );
  }
}
