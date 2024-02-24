import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:strongtify_mobile_app/common_blocs/user_favs/bloc.dart';
import 'package:strongtify_mobile_app/models/user_favs.dart';
import 'package:strongtify_mobile_app/services/api/me_service.dart';

@singleton
class UserFavsBloc extends Bloc<UserFavsEvent, UserFavsState> {
  UserFavsBloc(this._meService) : super(UserFavsState(data: UserFavs())) {
    on<LoadAllFavsEvent>(_onLoadAllFavs);

    on<LikeAlbumEvent>(_onLikeAlbum);
    on<UnlikeAlbumEvent>(_onUnlikeAlbum);

    on<LikePlaylistEvent>(_onLikePlaylist);
    on<UnlikePlaylistEvent>(_onUnlikePlaylist);

    on<LikeSongEvent>(_onLikeSong);
    on<UnlikeSongEvent>(_onUnlikeSong);

    on<FollowArtistEvent>(_onFollowArtist);
    on<UnFollowArtistEvent>(_onUnFollowArtist);

    on<FollowUserEvent>(_onFollowUser);
    on<UnFollowUserEvent>(_onUnFollowUser);
  }

  final MeService _meService;

  Future<void> _onLoadAllFavs(
    LoadAllFavsEvent event,
    Emitter<UserFavsState> emit,
  ) async {
    emit(state.copyWith(isLoadingFavs: true));

    try {
      final data = await _meService.getFavs();

      emit(state.copyWith(
        isLoadingFavs: false,
        data: data,
      ));
    } on Exception {
      emit(state.copyWith(isLoadingFavs: false));
    }
  }

  Future<void> _onLikeAlbum(
    LikeAlbumEvent event,
    Emitter<UserFavsState> emit,
  ) async {
    if (state.isLoadingFavs) return;

    _meService.likeAlbum(event.albumId);

    state.data.likedAlbumIds.add(event.albumId);
    emit(state.copyWith());
  }

  Future<void> _onUnlikeAlbum(
    UnlikeAlbumEvent event,
    Emitter<UserFavsState> emit,
  ) async {
    if (state.isLoadingFavs) return;

    _meService.unlikeAlbum(event.albumId);

    state.data.likedAlbumIds.remove(event.albumId);
    emit(state.copyWith());
  }

  Future<void> _onLikePlaylist(
    LikePlaylistEvent event,
    Emitter<UserFavsState> emit,
  ) async {
    if (state.isLoadingFavs) return;

    _meService.likePlaylist(event.playlistId);

    state.data.likedPlaylistIds.add(event.playlistId);
    emit(state.copyWith());
  }

  Future<void> _onUnlikePlaylist(
    UnlikePlaylistEvent event,
    Emitter<UserFavsState> emit,
  ) async {
    if (state.isLoadingFavs) return;

    _meService.unlikePlaylist(event.playlistId);

    state.data.likedPlaylistIds.remove(event.playlistId);
    emit(state.copyWith());
  }

  Future<void> _onLikeSong(
    LikeSongEvent event,
    Emitter<UserFavsState> emit,
  ) async {
    if (state.isLoadingFavs) return;

    _meService.likeSong(event.songId);

    state.data.likedSongIds.add(event.songId);
    emit(state.copyWith());
  }

  Future<void> _onUnlikeSong(
    UnlikeSongEvent event,
    Emitter<UserFavsState> emit,
  ) async {
    if (state.isLoadingFavs) return;

    _meService.unlikeSong(event.songId);

    state.data.likedSongIds.remove(event.songId);
    emit(state.copyWith());
  }

  Future<void> _onFollowArtist(
    FollowArtistEvent event,
    Emitter<UserFavsState> emit,
  ) async {
    if (state.isLoadingFavs) return;

    _meService.followArtist(event.artistId);

    state.data.followingArtistIds.add(event.artistId);
    emit(state.copyWith());
  }

  Future<void> _onUnFollowArtist(
    UnFollowArtistEvent event,
    Emitter<UserFavsState> emit,
  ) async {
    if (state.isLoadingFavs) return;

    _meService.unfollowArtist(event.artistId);

    state.data.followingArtistIds.remove(event.artistId);
    emit(state.copyWith());
  }

  Future<void> _onFollowUser(
    FollowUserEvent event,
    Emitter<UserFavsState> emit,
  ) async {
    if (state.isLoadingFavs) return;

    _meService.followUser(event.userId);

    state.data.followingUserIds.add(event.userId);
    emit(state.copyWith());
  }

  Future<void> _onUnFollowUser(
    UnFollowUserEvent event,
    Emitter<UserFavsState> emit,
  ) async {
    if (state.isLoadingFavs) return;

    _meService.unfollowUser(event.userId);

    state.data.followingUserIds.remove(event.userId);
    emit(state.copyWith());
  }
}
