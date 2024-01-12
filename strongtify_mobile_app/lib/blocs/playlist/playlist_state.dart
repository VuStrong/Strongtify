import 'package:strongtify_mobile_app/models/api_responses/paged_response.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist.dart';

class PlaylistState {
  final PagedResponse<Playlist>? playlists;

  PlaylistState({this.playlists});
}