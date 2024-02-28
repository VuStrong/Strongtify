import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/dio/dio_client.dart';
import 'package:strongtify_mobile_app/models/album/album.dart';
import 'package:strongtify_mobile_app/models/api_responses/paged_response.dart';
import 'package:strongtify_mobile_app/models/artist/artist.dart';
import 'package:strongtify_mobile_app/models/genre/genre.dart';
import 'package:strongtify_mobile_app/models/playlist/playlist.dart';
import 'package:strongtify_mobile_app/models/search_model.dart';
import 'package:strongtify_mobile_app/models/song/song.dart';
import 'package:strongtify_mobile_app/models/user/user.dart';
import 'package:strongtify_mobile_app/services/api/api_service.dart';

@injectable
class SearchService extends ApiService {
  SearchService(DioClient dioClient) : super(dioClient);

  Future<SearchModel> searchAll(String value) async {
    try {
      Response response = await dioClient.dio
          .get('/v1/search', queryParameters: {'take': 5, 'q': value});

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return SearchModel(
        songs: (data['songs']['results'] as List)
            .map((e) => Song.fromMap(e))
            .toList(),
        albums: (data['albums']['results'] as List)
            .map((e) => Album.fromMap(e))
            .toList(),
        playlists: (data['playlists']['results'] as List)
            .map((e) => Playlist.fromMap(e))
            .toList(),
        artists: (data['artists']['results'] as List)
            .map((e) => Artist.fromMap(e))
            .toList(),
        genres: (data['genres']['results'] as List)
            .map((e) => Genre.fromMap(e))
            .toList(),
        users: (data['users']['results'] as List)
            .map((e) => User.fromMap(e))
            .toList(),
      );
    } on DioException {
      throw Exception();
    }
  }

  Future<PagedResponse<Song>> searchSongs(
    String value, {
    int skip = 0,
    int take = 10,
  }) async {
    try {
      Response response =
          await dioClient.dio.get('/v1/songs', queryParameters: {
        'take': take,
        'q': value,
        'skip': skip,
      });

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return PagedResponse(
        items: (data['results'] as List).map((e) => Song.fromMap(e)).toList(),
        total: data['total'],
        skip: data['skip'],
        take: data['take'],
        end: data['end'],
      );
    } on DioException {
      throw Exception();
    }
  }

  Future<PagedResponse<Album>> searchAlbums(
      String value, {
        int skip = 0,
        int take = 10,
      }) async {
    try {
      Response response =
      await dioClient.dio.get('/v1/albums', queryParameters: {
        'take': take,
        'q': value,
        'skip': skip,
      });

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return PagedResponse(
        items: (data['results'] as List).map((e) => Album.fromMap(e)).toList(),
        total: data['total'],
        skip: data['skip'],
        take: data['take'],
        end: data['end'],
      );
    } on DioException {
      throw Exception();
    }
  }

  Future<PagedResponse<Playlist>> searchPlaylists(
      String value, {
        int skip = 0,
        int take = 10,
      }) async {
    try {
      Response response =
      await dioClient.dio.get('/v1/playlists', queryParameters: {
        'take': take,
        'q': value,
        'skip': skip,
      });

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return PagedResponse(
        items: (data['results'] as List).map((e) => Playlist.fromMap(e)).toList(),
        total: data['total'],
        skip: data['skip'],
        take: data['take'],
        end: data['end'],
      );
    } on DioException {
      throw Exception();
    }
  }

  Future<PagedResponse<Artist>> searchArtists(
      String value, {
        int skip = 0,
        int take = 10,
      }) async {
    try {
      Response response =
      await dioClient.dio.get('/v1/artists', queryParameters: {
        'take': take,
        'q': value,
        'skip': skip,
      });

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return PagedResponse(
        items: (data['results'] as List).map((e) => Artist.fromMap(e)).toList(),
        total: data['total'],
        skip: data['skip'],
        take: data['take'],
        end: data['end'],
      );
    } on DioException {
      throw Exception();
    }
  }

  Future<PagedResponse<User>> searchUsers(
      String value, {
        int skip = 0,
        int take = 10,
      }) async {
    try {
      Response response =
      await dioClient.dio.get('/v1/users', queryParameters: {
        'take': take,
        'q': value,
        'skip': skip,
      });

      Map<String, dynamic> data = Map<String, dynamic>.from(response.data);

      return PagedResponse(
        items: (data['results'] as List).map((e) => User.fromMap(e)).toList(),
        total: data['total'],
        skip: data['skip'],
        take: data['take'],
        end: data['end'],
      );
    } on DioException {
      throw Exception();
    }
  }
}
