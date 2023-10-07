import { Module } from "@nestjs/common";
import { ArtistsController } from "./artists.controller";
import { DatabaseModule } from "src/database/database.module";
import { UploadModule } from "src/upload/upload.module";
import { CaslModule } from "src/casl/casl.module";
import { StringService } from "src/common/utils/string.service";
import { GetArtistServiceImpl } from "./services/get-artist.service";
import { ARTIST_SERVICES } from "./interfaces/constants";
import { CudArtistServiceImpl } from "./services/cud-artist.service";

const getArtistService = {
    provide: ARTIST_SERVICES.GetArtistService,
    useClass: GetArtistServiceImpl,
};

const cudArtistService = {
    provide: ARTIST_SERVICES.CudArtistService,
    useClass: CudArtistServiceImpl,
};

@Module({
    imports: [DatabaseModule, UploadModule, CaslModule],
    controllers: [ArtistsController],
    providers: [StringService, getArtistService, cudArtistService],
    exports: [getArtistService],
})
export class ArtistsModule {}
