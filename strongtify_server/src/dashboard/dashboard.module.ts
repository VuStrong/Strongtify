import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { PlaylistsModule } from "src/resources/playlists/playlists.module";
import { UsersModule } from "src/resources/users/users.module";
import { CaslModule } from "src/casl/casl.module";
import { DatabaseModule } from "src/database/database.module";

@Module({
    imports: [
        PlaylistsModule,
        UsersModule,
        CaslModule,
        DatabaseModule,
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {}