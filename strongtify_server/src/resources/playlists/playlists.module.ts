import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { UploadModule } from "src/upload/upload.module";
import { PlaylistsController } from "./playlists.controller";
import { CaslModule } from "src/casl/casl.module";
import { GetPlaylistByIdMiddleware } from "./middlewares/get-playlist-by-id.middleware";
import { StringService } from "src/common/utils/string.service";
import { PLAYLIST_SERVICES } from "./interfaces/constants";
import { GetPlaylistServiceImpl } from "./services/get-playlist.service";
import { CudPlaylistServiceImpl } from "./services/cud-playlist.service";
import { ManagePlaylistSongsServiceImpl } from "./services/manage-playlist-songs.service";

const getPlaylistService = {
    provide: PLAYLIST_SERVICES.GetPlaylistService,
    useClass: GetPlaylistServiceImpl,
};

const cudPlaylistService = {
    provide: PLAYLIST_SERVICES.CudPlaylistService,
    useClass: CudPlaylistServiceImpl,
};

const managePlaylistSongsService = {
    provide: PLAYLIST_SERVICES.ManagePlaylistSongsService,
    useClass: ManagePlaylistSongsServiceImpl,
};

@Module({
    imports: [DatabaseModule, UploadModule, CaslModule],
    controllers: [PlaylistsController],
    providers: [
        StringService,
        getPlaylistService,
        cudPlaylistService,
        managePlaylistSongsService,
    ],
    exports: [getPlaylistService],
})
export class PlaylistsModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer.apply(GetPlaylistByIdMiddleware).forRoutes(
            { path: "v1/playlists/:id", method: RequestMethod.PUT },
            { path: "v1/playlists/:id", method: RequestMethod.DELETE },
            {
                path: "v1/playlists/:id/songs/:songId",
                method: RequestMethod.PUT,
            },
            {
                path: "v1/playlists/:id/songs",
                method: RequestMethod.POST,
            },
            {
                path: "v1/playlists/:id/songs/:songId",
                method: RequestMethod.DELETE,
            },
        );
    }
}
