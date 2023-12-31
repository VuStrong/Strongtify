import { Module } from "@nestjs/common";
import { SongsController } from "./songs.controller";
import { DatabaseModule } from "src/database/database.module";
import { UploadModule } from "src/upload/upload.module";
import { CaslModule } from "src/casl/casl.module";
import { StringService } from "src/common/utils/string.service";
import { ArrayService } from "src/common/utils/array.service";
import { CacheModule } from "src/cache/cache.module";
import { SONG_SERVICES } from "./interfaces/constants";
import { GetSongServiceImpl } from "./services/get-song.service";
import { CudSongServiceImpl } from "./services/cud-song.service";
import { SongListenServiceImpl } from "./services/song-listen.service";
import { TopSongsServiceImpl } from "./services/top-songs.service";

const getSongService = {
    provide: SONG_SERVICES.GetSongService,
    useClass: GetSongServiceImpl,
};

const cudSongService = {
    provide: SONG_SERVICES.CudSongService,
    useClass: CudSongServiceImpl,
};

const songListenService = {
    provide: SONG_SERVICES.SongListenService,
    useClass: SongListenServiceImpl,
};

const topSongsService = {
    provide: SONG_SERVICES.TopSongsService,
    useClass: TopSongsServiceImpl,
};

@Module({
    imports: [DatabaseModule, UploadModule, CacheModule, CaslModule],
    controllers: [SongsController],
    providers: [
        StringService,
        ArrayService,
        getSongService,
        cudSongService,
        songListenService,
        topSongsService,
    ],
    exports: [getSongService],
})
export class SongsModule {}
