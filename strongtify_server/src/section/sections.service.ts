import { Inject, Injectable } from "@nestjs/common";
import { PlaylistStatus } from "@prisma/client";
import { Section } from "src/section/section.dto";
import { ArtistResponseDto } from "src/resources/artists/dtos/get/artist-response.dto";
import { SongResponseDto } from "src/resources/songs/dtos/get/song-response.dto";
import { GetAlbumService } from "src/resources/albums/interfaces/get-album-service.interface";
import { ALBUM_SERVICES } from "src/resources/albums/interfaces/constants";
import { ARTIST_SERVICES } from "src/resources/artists/interfaces/constants";
import { GetArtistService } from "src/resources/artists/interfaces/get-artist-service.interface";
import { GENRE_SERVICES } from "src/resources/genres/interfaces/constants";
import { GetGenreService } from "src/resources/genres/interfaces/get-genre-service.interface";
import { PLAYLIST_SERVICES } from "src/resources/playlists/interfaces/constants";
import { GetPlaylistService } from "src/resources/playlists/interfaces/get-playlist-service.interface";
import { AlbumResponseDto } from "src/resources/albums/dtos/get/album-response.dto";
import { PlaylistResponseDto } from "src/resources/playlists/dtos/get/playlist-response.dto";
import { SONG_SERVICES } from "src/resources/songs/interfaces/constants";
import { GetSongService } from "src/resources/songs/interfaces/get-song-service.interface";
import { USER_SERVICES } from "src/resources/users/interfaces/constants";
import { RecommendService } from "src/resources/users/interfaces/recommend-service.interface";

const ALBUMS_PER_SECTION = 5;
const PLAYLISTS_PER_SECTION = 5;
const ARTISTS_PER_SECTION = 5;
const SONGS_PER_SECTION = 10;

@Injectable()
export class SectionsService {
    constructor(
        @Inject(USER_SERVICES.RecommendService)
        private readonly recommendService: RecommendService,
        @Inject(PLAYLIST_SERVICES.GetPlaylistService)
        private readonly getPlaylistService: GetPlaylistService,
        @Inject(SONG_SERVICES.GetSongService)
        private readonly getSongService: GetSongService,
        @Inject(GENRE_SERVICES.GetGenreService)
        private readonly getGenreService: GetGenreService,
        @Inject(ARTIST_SERVICES.GetArtistService)
        private readonly getArtistService: GetArtistService,
        @Inject(ALBUM_SERVICES.GetAlbumService)
        private readonly getAlbumService: GetAlbumService,
    ) {}

    public async getNewReleasedSongs(): Promise<Section<any>> {
        const songs = await this.getSongService.get({
            take: SONGS_PER_SECTION,
            allowCount: false,
            sort: "releasedAt_desc",
        });

        return {
            title: "Bài Hát Mới Phát Hành",
            type: "songs",
            items: SongResponseDto.toSongResponseDto(songs.results),
        };
    }

    public async getRandomAlbumsSection(): Promise<Section<any>> {
        const randomAlbums = await this.getAlbumService.getRandomAlbums(
            ALBUMS_PER_SECTION,
        );

        return {
            title: "Hôm Nay Nghe Gì?",
            type: "albums",
            items: AlbumResponseDto.toAlbumResponseDto(randomAlbums),
        };
    }

    public async getGenreSections(): Promise<Section<any>[]> {
        const randomGenres = await this.getGenreService.getRandomGenres(2, {
            albums: {
                include: {
                    genres: true,
                    artist: true,
                },
                orderBy: { likeCount: "desc" },
                take: ALBUMS_PER_SECTION,
            },
        });

        return randomGenres.map((genre) => ({
            title: genre.name,
            type: "albums",
            link: `/genres/${genre.alias}/${genre.id}/albums`,
            items: AlbumResponseDto.toAlbumResponseDto(genre.albums),
        }));
    }

    public async getHotAlbumsSection(): Promise<Section<any>> {
        const hotAlbums = await this.getAlbumService.get({
            sort: "likeCount_desc",
            take: ALBUMS_PER_SECTION,
            allowCount: false,
        });

        return {
            title: "Album Hot",
            type: "albums",
            items: AlbumResponseDto.toAlbumResponseDto(hotAlbums.results),
        };
    }

    public async getTopArtistsSection(): Promise<Section<any>> {
        const topArtists = await this.getArtistService.get({
            allowCount: false,
            sort: "followerCount_desc",
            take: ARTISTS_PER_SECTION,
        });

        return {
            title: "Nghệ Sĩ Thịnh Hành",
            type: "artists",
            items: ArtistResponseDto.toArtistResponseDto(topArtists.results),
        };
    }

    public async getUserRecommendation(userId: string): Promise<Section<any>> {
        const albums = await this.recommendService.getUserRecommendedAlbums(
            userId,
            ALBUMS_PER_SECTION,
        );

        return {
            title: `Dành cho bạn`,
            type: "albums",
            items: AlbumResponseDto.toAlbumResponseDto(albums),
        };
    }

    public async getPlaylistSection(): Promise<Section<any>> {
        const playlists = await this.getPlaylistService.get({
            status: PlaylistStatus.PUBLIC,
            allowCount: false,
            sort: "likeCount_desc",
            take: PLAYLISTS_PER_SECTION,
        });

        return {
            title: "Các Playlist Nổi Bật",
            type: "playlists",
            items: PlaylistResponseDto.toPlaylistResponseDto(playlists.results),
        };
    }
}
