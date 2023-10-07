import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { UploadModule } from "src/upload/upload.module";
import { CaslModule } from "src/casl/casl.module";
import { AlbumsController } from "./albums.controller";
import { StringService } from "src/common/utils/string.service";
import { ArrayService } from "src/common/utils/array.service";
import { ALBUM_SERVICES } from "./interfaces/constants";
import { CudAlbumServiceImpl } from "./services/cud-album.service";
import { ManageAlbumSongsServiceImpl } from "./services/manage-album-songs.service";
import { GetAlbumServiceImpl } from "./services/get-album.service";

const cudAlbumService = {
    provide: ALBUM_SERVICES.CudAlbumService,
    useClass: CudAlbumServiceImpl,
};

const getAlbumService = {
    provide: ALBUM_SERVICES.GetAlbumService,
    useClass: GetAlbumServiceImpl,
};

const manageAlbumSongsService = {
    provide: ALBUM_SERVICES.ManageAlbumSongsService,
    useClass: ManageAlbumSongsServiceImpl,
};

@Module({
    imports: [DatabaseModule, UploadModule, CaslModule],
    controllers: [AlbumsController],
    providers: [
        StringService,
        ArrayService,
        cudAlbumService,
        getAlbumService,
        manageAlbumSongsService,
    ],
    exports: [getAlbumService],
})
export class AlbumsModule {}
