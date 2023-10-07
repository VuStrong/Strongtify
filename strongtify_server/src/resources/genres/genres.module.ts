import { Module } from "@nestjs/common";
import { GenresController } from "./genres.controller";
import { DatabaseModule } from "src/database/database.module";
import { UploadModule } from "src/upload/upload.module";
import { CaslModule } from "src/casl/casl.module";
import { StringService } from "src/common/utils/string.service";
import { GENRE_SERVICES } from "./interfaces/constants";
import { GetGenreServiceImpl } from "./services/get-genre.service";
import { CudGenreServiceImpl } from "./services/cud-genre.service";

const getGenreService = {
    provide: GENRE_SERVICES.GetGenreService,
    useClass: GetGenreServiceImpl,
};

const cudGenreService = {
    provide: GENRE_SERVICES.CudGenreService,
    useClass: CudGenreServiceImpl,
};

@Module({
    imports: [DatabaseModule, UploadModule, CaslModule],
    controllers: [GenresController],
    providers: [StringService, getGenreService, cudGenreService],
    exports: [getGenreService],
})
export class GenresModule {}
