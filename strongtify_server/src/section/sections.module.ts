import { Module } from "@nestjs/common";
import { SectionsService } from "./sections.service";
import { GenresModule } from "src/resources/genres/genres.module";
import { PlaylistsModule } from "src/resources/playlists/playlists.module";
import { ArtistsModule } from "src/resources/artists/artists.module";
import { AlbumsModule } from "src/resources/albums/albums.module";
import { SongsModule } from "src/resources/songs/songs.module";
import { UsersModule } from "src/resources/users/users.module";

@Module({
    imports: [
        SongsModule,
        AlbumsModule,
        ArtistsModule,
        PlaylistsModule,
        GenresModule,
        UsersModule,
    ],
    providers: [SectionsService],
    exports: [SectionsService],
})
export class SectionsModule {}
