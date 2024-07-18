import { Inject, Injectable } from "@nestjs/common";
import { SearchResponseDto } from "./common/dtos/search-response.dto";
import { Section } from "./section/section.dto";
import { SectionsService } from "./section/sections.service";
import {
    CACHE_SERVICE,
    CacheService,
} from "./cache/interfaces/cache.interface";
import { GetAlbumService } from "./resources/albums/interfaces/get-album-service.interface";
import { ALBUM_SERVICES } from "./resources/albums/interfaces/constants";
import { ARTIST_SERVICES } from "./resources/artists/interfaces/constants";
import { GetArtistService } from "./resources/artists/interfaces/get-artist-service.interface";
import { GENRE_SERVICES } from "./resources/genres/interfaces/constants";
import { GetGenreService } from "./resources/genres/interfaces/get-genre-service.interface";
import { PLAYLIST_SERVICES } from "./resources/playlists/interfaces/constants";
import { GetPlaylistService } from "./resources/playlists/interfaces/get-playlist-service.interface";
import { SONG_SERVICES } from "./resources/songs/interfaces/constants";
import { GetSongService } from "./resources/songs/interfaces/get-song-service.interface";
import { USER_SERVICES } from "./resources/users/interfaces/constants";
import { GetUserService } from "./resources/users/interfaces/get-user-service.interface";

@Injectable()
export class AppService {
    constructor(
        @Inject(USER_SERVICES.GetUserService)
        private readonly getUserService: GetUserService,
        @Inject(PLAYLIST_SERVICES.GetPlaylistService)
        private readonly getPlaylistService: GetPlaylistService,
        @Inject(SONG_SERVICES.GetSongService)
        private readonly getSongService: GetSongService,
        @Inject(GENRE_SERVICES.GetGenreService)
        private readonly getGenreService: GetGenreService,
        @Inject(ALBUM_SERVICES.GetAlbumService)
        private readonly getAlbumService: GetAlbumService,
        @Inject(ARTIST_SERVICES.GetArtistService)
        private readonly getArtistService: GetArtistService,
        private readonly sectionsService: SectionsService,
        @Inject(CACHE_SERVICE) private readonly cacheService: CacheService,
    ) {}

    async getSections(): Promise<Section<any>[]> {
        const cachedSections = await this.cacheService.get("cached-sections");

        if (cachedSections) {
            return cachedSections;
        }

        const sectionTasks: any[] = [
            this.sectionsService.getNewReleasedSongs(),
            this.sectionsService.getGenreSections(),
            this.sectionsService.getHotAlbumsSection(),
            this.sectionsService.getRandomAlbumsSection(),
            this.sectionsService.getPlaylistSection(),
            this.sectionsService.getTopArtistsSection(),
        ];

        const sections: Section<any>[] = [].concat(...(await Promise.all(sectionTasks)));

        await this.cacheService.set(
            "cached-sections",
            JSON.stringify(sections),
        );

        return sections;
    }

    async search(
        keyword: string,
        options: {
            take: number;
            allowCount: boolean;
        },
    ): Promise<SearchResponseDto> {
        const skip = 0,
            { take, allowCount } = options;

        const [songs, albums, playlists, genres, artists, users] =
            await Promise.all([
                this.getSongService.get({
                    skip,
                    take,
                    allowCount,
                    keyword,
                }),
                this.getAlbumService.get({
                    skip,
                    take,
                    allowCount,
                    keyword,
                }),
                this.getPlaylistService.get({
                    skip,
                    take,
                    allowCount,
                    keyword,
                }),
                this.getGenreService.get({
                    skip,
                    take,
                    allowCount,
                    keyword,
                }),
                this.getArtistService.get({
                    skip,
                    take,
                    allowCount,
                    keyword,
                }),
                this.getUserService.get({
                    skip,
                    take,
                    allowCount,
                    keyword,
                }),
            ]);

        return {
            users,
            playlists,
            songs,
            genres,
            albums,
            artists,
        };
    }
}
