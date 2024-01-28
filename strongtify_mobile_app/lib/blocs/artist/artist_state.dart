import 'package:strongtify_mobile_app/models/artist/artist_detail.dart';

abstract class ArtistState {}

class LoadingArtistState extends ArtistState {}

class LoadedArtistByIdState extends ArtistState {
  final ArtistDetail? artist;

  LoadedArtistByIdState({
    this.artist,
  });
}
