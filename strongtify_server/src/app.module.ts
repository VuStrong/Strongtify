import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { JwtMiddleware } from "./auth/middlewares/jwt.middleware";

import { AuthModule } from "./auth/auth.module";
import { AlbumsModule } from "./resources/albums/albums.module";
import { UsersModule } from "./resources/users/users.module";
import { SongsModule } from "./resources/songs/songs.module";
import { ArtistsModule } from "./resources/artists/artists.module";
import { PlaylistsModule } from "./resources/playlists/playlists.module";
import { GenresModule } from "./resources/genres/genres.module";
import { SectionsModule } from "./section/sections.module";
import { CacheModule } from "./cache/cache.module";
import { FFApiController } from "./ffapi.controller";
import { JwtService } from "@nestjs/jwt";
import { DashboardModule } from "./dashboard/dashboard.module";

@Module({
    imports: [
        ConfigModule.forRoot(),
        CacheModule,
        SectionsModule,
        SongsModule,
        AlbumsModule,
        ArtistsModule,
        PlaylistsModule,
        GenresModule,
        UsersModule,
        AuthModule,
        DashboardModule,
    ],
    controllers: [AppController, FFApiController],
    providers: [AppService, JwtService],
})
export class AppModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer.apply(JwtMiddleware).forRoutes("*");
    }
}
