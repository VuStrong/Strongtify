import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from "@nestjs/common";
import { GetUserByIdMiddleware } from "./middlewares/get-user-by-id.middleware";
import { DatabaseModule } from "src/database/database.module";
import { UploadModule } from "src/upload/upload.module";
import { CaslModule } from "src/casl/casl.module";

import { AccountsController } from "./controllers/accounts.controller";
import { UsersController } from "./controllers/users.controller";
import { MeController } from "./controllers/me.controller";
import { StringService } from "src/common/utils/string.service";
import { USER_SERVICES } from "./interfaces/constants";
import { CudUserServiceImpl } from "./services/cud-user.service";
import { GetUserServiceImpl } from "./services/get-user.service";
import { TokenServiceImpl } from "./services/token.service";
import { PasswordServiceImpl } from "./services/password.service";
import { UserEmailServiceImpl } from "./services/user-email.service";
import { LikeAlbumServiceImpl } from "./services/like-and-follow/like-album.service";
import { LikeSongServiceImpl } from "./services/like-and-follow/like-song.service";
import { LikePlaylistServiceImpl } from "./services/like-and-follow/like-playlist.service";
import { FollowArtistServiceImpl } from "./services/like-and-follow/follow-artist.service";
import { FollowUserServiceImpl } from "./services/like-and-follow/follow-user.service";
import { UserListenServiceImpl } from "./services/user-listen.service";
import { StatisticUserServiceImpl } from "./services/statistic-user.service";

const cudUserService = {
    provide: USER_SERVICES.CudUserService,
    useClass: CudUserServiceImpl,
};

const getUserService = {
    provide: USER_SERVICES.GetUserService,
    useClass: GetUserServiceImpl,
};

const tokenService = {
    provide: USER_SERVICES.TokenService,
    useClass: TokenServiceImpl,
};

const passwordService = {
    provide: USER_SERVICES.PasswordService,
    useClass: PasswordServiceImpl,
};

const userEmailService = {
    provide: USER_SERVICES.UserEmailService,
    useClass: UserEmailServiceImpl,
};

const likeAlbumService = {
    provide: USER_SERVICES.LikeAlbumService,
    useClass: LikeAlbumServiceImpl,
};

const likeSongService = {
    provide: USER_SERVICES.LikeSongService,
    useClass: LikeSongServiceImpl,
};

const likePlaylistService = {
    provide: USER_SERVICES.LikePlaylistService,
    useClass: LikePlaylistServiceImpl,
};

const followArtistService = {
    provide: USER_SERVICES.FollowArtistService,
    useClass: FollowArtistServiceImpl,
};

const followUserService = {
    provide: USER_SERVICES.FollowUserService,
    useClass: FollowUserServiceImpl,
};

const userListenService = {
    provide: USER_SERVICES.UserListenService,
    useClass: UserListenServiceImpl,
};

const statisticUserService = {
    provide: USER_SERVICES.StatisticUserService,
    useClass: StatisticUserServiceImpl,
};

@Module({
    imports: [DatabaseModule, UploadModule, CaslModule],
    controllers: [UsersController, MeController, AccountsController],
    providers: [
        StringService,
        cudUserService,
        getUserService,
        passwordService,
        tokenService,
        userEmailService,
        likeAlbumService,
        likePlaylistService,
        likeSongService,
        followArtistService,
        followUserService,
        userListenService,
        statisticUserService,
    ],
    exports: [
        getUserService,
        cudUserService,
        tokenService,
        userEmailService,
        passwordService,
        statisticUserService,
        userListenService,
    ],
})
export class UsersModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(GetUserByIdMiddleware)
            .forRoutes(
                { path: "v1/accounts/:id", method: RequestMethod.PATCH },
                { path: "v1/accounts/:id", method: RequestMethod.DELETE },
            );
    }
}
