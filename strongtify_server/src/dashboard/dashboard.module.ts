import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { PlaylistsModule } from "src/resources/playlists/playlists.module";
import { UsersModule } from "src/resources/users/users.module";
import { CaslModule } from "src/casl/casl.module";
import { CacheModule } from "src/cache/cache.module";

@Module({
    imports: [
        PlaylistsModule,
        UsersModule,
        CaslModule,
        CacheModule,
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {}