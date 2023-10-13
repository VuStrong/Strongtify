import {
    Controller,
    Get,
    Head,
    Inject,
    NotFoundException,
    Param,
    Query,
    UseInterceptors,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";
import { PlaylistStatus } from "@prisma/client";
import { TransformDataInterceptor } from "src/common/interceptors/transform-data.interceptor";
import { PagingQuery } from "src/common/decorators/paging-query.decorator";
import { ApiPaging } from "src/common/decorators/api/api-paging.decorator";
import { User } from "../decorators/user.decorator";
import { ACCESS_TOKEN } from "src/auth/constants";

import { QueryParamDto } from "src/common/dtos/query-param.dto";
import { UserResponseDto } from "../dtos/get/user-response.dto";
import { UserDetailResponseDto } from "../dtos/get/user-detail-response.dto";
import { UserDetailParamDto } from "../dtos/query-params/user-detail-param.dto";
import { ArtistResponseDto } from "src/resources/artists/dtos/get/artist-response.dto";
import { USER_SERVICES } from "../interfaces/constants";
import { GetUserService } from "../interfaces/get-user-service.interface";
import { FollowArtistService } from "../interfaces/like-and-follow/follow-artist-service.interface";
import { FollowUserService } from "../interfaces/like-and-follow/follow-user-service.interface";

@ApiTags("users")
@Controller({
    path: "users",
    version: "1",
})
export class UsersController {
    constructor(
        @Inject(USER_SERVICES.GetUserService)
        private readonly getUserService: GetUserService,
        @Inject(USER_SERVICES.FollowArtistService)
        private readonly followArtistService: FollowArtistService,
        @Inject(USER_SERVICES.FollowUserService)
        private readonly followUserService: FollowUserService,
    ) {}

    @ApiOperation({ summary: "Get users" })
    @ApiPaging(UserResponseDto, QueryParamDto)
    @Get()
    @UseInterceptors(new TransformDataInterceptor(UserResponseDto))
    async getUsers(@PagingQuery(QueryParamDto) params: QueryParamDto) {
        return this.getUserService.get(params);
    }

    @ApiOperation({ summary: "Get user's detail" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @ApiOkResponse({ type: UserDetailResponseDto })
    @ApiNotFoundResponse({ description: "User not found" })
    @Get(":id")
    @UseInterceptors(new TransformDataInterceptor(UserDetailResponseDto))
    async getUserById(
        @Param("id") id: string,
        @User("sub") userId: string,
        @Query() userDetailParamDto: UserDetailParamDto,
    ) {
        // if param id !== id of current user, then only take public playlists
        if (id !== userId)
            userDetailParamDto.playlistStatus = PlaylistStatus.PUBLIC;

        return this.getUserService.findByIdWithDetails(id, userDetailParamDto);
    }

    @ApiOperation({ summary: "Get user's followings" })
    @ApiPaging(UserResponseDto, QueryParamDto)
    @ApiNotFoundResponse({ description: "User not found" })
    @Get(":id/following-users")
    @UseInterceptors(new TransformDataInterceptor(UserResponseDto))
    async getFollowingUsers(
        @Param("id") id: string,
        @PagingQuery(QueryParamDto) params: QueryParamDto,
    ) {
        return this.followUserService.getFollowingUsers(id, params);
    }

    @ApiOperation({ summary: "Check if user follow an user or not" })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    @Head(":id/following-users/:idToCheck")
    async checkFollowingUser(
        @Param("id") id: string,
        @Param("idToCheck") idToCheck: string,
    ) {
        const isFollowed = await this.followUserService.checkFollowingUser(
            id,
            idToCheck,
        );

        if (!isFollowed) throw new NotFoundException();
    }

    @ApiOperation({ summary: "Get user's followers" })
    @ApiPaging(UserResponseDto, QueryParamDto)
    @ApiNotFoundResponse({ description: "User not found" })
    @Get(":id/followers")
    @UseInterceptors(new TransformDataInterceptor(UserResponseDto))
    async getFollowers(
        @Param("id") id: string,
        @PagingQuery(QueryParamDto) params: QueryParamDto,
    ) {
        return this.followUserService.getFollowers(id, params);
    }

    @ApiOperation({ summary: "Get user's following artists" })
    @ApiPaging(ArtistResponseDto, QueryParamDto)
    @ApiNotFoundResponse({ description: "User not found" })
    @Get(":id/following-artists")
    @UseInterceptors(new TransformDataInterceptor(ArtistResponseDto))
    async getFollowingArtists(
        @Param("id") id: string,
        @PagingQuery(QueryParamDto) params: QueryParamDto,
    ) {
        return this.followArtistService.getFollowingArtists(id, params);
    }

    @ApiOperation({ summary: "Check if user follow an artist or not" })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    @Head(":id/following-artists/:artistId")
    async checkFollowingArtist(
        @Param("id") id: string,
        @Param("artistId") artistId: string,
    ) {
        const isFollowed = await this.followArtistService.checkFollowingArtist(
            id,
            artistId,
        );

        if (!isFollowed) throw new NotFoundException();
    }
}
