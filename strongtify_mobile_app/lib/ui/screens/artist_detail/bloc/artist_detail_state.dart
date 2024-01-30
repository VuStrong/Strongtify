import 'package:strongtify_mobile_app/models/artist/artist_detail.dart';

class ArtistDetailState {
  final ArtistDetail? artist;
  final bool isLoading;

  ArtistDetailState({
    this.artist,
    this.isLoading = false,
  });
}