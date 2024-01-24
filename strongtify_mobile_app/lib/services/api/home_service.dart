import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/dio/dio_client.dart';
import 'package:strongtify_mobile_app/models/album/album.dart';
import 'package:strongtify_mobile_app/models/artist/artist.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist.dart';
import 'package:strongtify_mobile_app/models/section.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/services/api/api_service.dart';

@injectable
class HomeService extends ApiService {
  HomeService(DioClient dioClient) : super(dioClient);

  Future<List<Section>> getHomeSections() async {
    try {
      Response response = await dioClient.dio.get('/v1/sections');

      List data = response.data as List;
      List<Section> sections = _mapToSections(data);

      return sections;
    } on DioException {
      throw Exception();
    }
  }

  List<Section> _mapToSections(List data) {
    List<Section> sections = [];

    for (final e in data) {
      String type = e['type'];

      if (type == 'playlists') {
        sections.add(Section<Playlist>(
          title: e['title'],
          type: type,
          link: e['link'],
          items: (e['items'] as List)
              .map((item) => Playlist.fromMap(item))
              .toList(),
        ));
      } else if (type == 'songs') {
        sections.add(Section<Song>(
          title: e['title'],
          type: type,
          link: e['link'],
          items: (e['items'] as List)
              .map((item) => Song.fromMap(item))
              .toList(),
        ));
      } else if (type == 'albums') {
        sections.add(Section<Album>(
          title: e['title'],
          type: type,
          link: e['link'],
          items: (e['items'] as List)
              .map((item) => Album.fromMap(item))
              .toList(),
        ));
      } else if (type == 'artists') {
        sections.add(Section<Artist>(
          title: e['title'],
          type: type,
          link: e['link'],
          items: (e['items'] as List)
              .map((item) => Artist.fromMap(item))
              .toList(),
        ));
      }
    }

    return sections;
  }
}
