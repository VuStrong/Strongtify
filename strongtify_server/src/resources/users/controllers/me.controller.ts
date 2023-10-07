import {
    Body,
    Controller,
    Delete,
    Get,
    Head,
    Inject,
    NotFoundException,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiConsumes,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiCreatedResponse,
} from "@nestjs/swagger";
import { TransformDataInterceptor } from "src/common/interceptors/transform-data.interceptor";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { ACCESS_TOKEN } from "src/auth/constants";
import { ApiPaging } from "src/common/decorators/api/api-paging.decorator";
import { PagingQuery } from "src/common/decorators/paging-query.decorator";
import { ApiBodyId } from "src/common/decorators/api/api-body-id.decorator";
import { AnonymousEmail } from "src/auth/decorators/anonymous-email.decorator";
import { User } from "../decorators/user.decorator";

import { StringValidationPipe } from "src/common/pipes/string-validation.pipe";

import { AccountResponseDto } from "../dtos/get/account-response.dto";
import { SongResponseDto } from "src/resources/songs/dtos/get/song-response.dto";
import { PagingParamDto } from "src/common/dtos/paging-param.dto";
import { UpdateAccountDto } from "../dtos/update-account.dto";
import { ChangePasswordDto } from "../dtos/change-password.dto";
import { AlbumResponseDto } from "src/resources/albums/dtos/get/album-response.dto";
import { PlaylistResponseDto } from "src/resources/playlists/dtos/get/playlist-response.dto";
import { USER_SERVICES } from "../interfaces/constants";
import { CudUserService } from "../interfaces/cud-user-service.interface";
import { GetUserService } from "../interfaces/get-user-service.interface";
import { LikeSongService } from "../interfaces/like-and-follow/like-song-service.interface";
import { LikeAlbumService } from "../interfaces/like-and-follow/like-album-service.interface";
import { LikePlaylistService } from "../interfaces/like-and-follow/like-playlist-service.interface";
import { PasswordService } from "../interfaces/password-service.interface";
import { FollowArtistService } from "../interfaces/like-and-follow/follow-artist-service.interface";
import { FollowUserService } from "../interfaces/like-and-follow/follow-user-service.interface";
import { RecommendService } from "../interfaces/recommend-service.interface";

@ApiTags("me")
@ApiBearerAuth(ACCESS_TOKEN)
@Controller({
    path: "me",
    version: "1",
})
@UseGuards(AuthGuard)
export class MeController {
    constructor(
        @Inject(USER_SERVICES.GetUserService)
        private readonly getUserService: GetUserService,
        @Inject(USER_SERVICES.CudUserService)
        private readonly cudUserService: CudUserService,
        @Inject(USER_SERVICES.LikeSongService)
        private readonly likeSongService: LikeSongService,
        @Inject(USER_SERVICES.LikeAlbumService)
        private readonly likeAlbumService: LikeAlbumService,
        @Inject(USER_SERVICES.LikePlaylistService)
        private readonly likePlaylistService: LikePlaylistService,
        @Inject(USER_SERVICES.FollowArtistService)
        private readonly followArtistService: FollowArtistService,
        @Inject(USER_SERVICES.FollowUserService)
        private readonly followUserService: FollowUserService,
        @Inject(USER_SERVICES.PasswordService)
        private readonly passwordService: PasswordService,
        @Inject(USER_SERVICES.RecommendService)
        private readonly recommendService: RecommendService,
    ) {}

    @ApiOperation({ summary: "Get current user's information" })
    @ApiOkResponse({ type: AccountResponseDto })
    @Get()
    @AnonymousEmail()
    @UseInterceptors(new TransformDataInterceptor(AccountResponseDto))
    async getAccount(@User("sub") id: string) {
        return this.getUserService.findById(id);
    }

    @ApiPaging(SongResponseDto, PagingParamDto)
    @ApiOperation({ summary: "Get current user's liked songs" })
    @Get("liked-songs")
    @UseInterceptors(new TransformDataInterceptor(SongResponseDto))
    async getLikedSongs(
        @User("sub") id: string,
        @PagingQuery(PagingParamDto) pagingParams: PagingParamDto,
    ) {
        return this.likeSongService.getLikedSongs(id, pagingParams);
    }

    @ApiOperation({ summary: "Check if current user like a song or not" })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    @Head("liked-songs/:songId")
    async checkLikedSong(
        @User("sub") id: string,
        @Param("songId") songId: string,
    ) {
        const isLiked = await this.likeSongService.checkLikedSong(id, songId);

        if (!isLiked) throw new NotFoundException();
    }

    @ApiPaging(AlbumResponseDto, PagingParamDto)
    @ApiOperation({ summary: "Get current user's liked albums" })
    @Get("liked-albums")
    @UseInterceptors(new TransformDataInterceptor(AlbumResponseDto))
    async getLikedAlbums(
        @User("sub") id: string,
        @PagingQuery(PagingParamDto) pagingParams: PagingParamDto,
    ) {
        return this.likeAlbumService.getLikedAlbums(id, pagingParams);
    }

    @ApiOperation({ summary: "Check if current user like an album or not" })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    @Head("liked-albums/:albumId")
    async checkLikedAlbum(
        @User("sub") id: string,
        @Param("albumId") albumId: string,
    ) {
        const isLiked = await this.likeAlbumService.checkLikedAlbum(
            id,
            albumId,
        );

        if (!isLiked) throw new NotFoundException();
    }

    @ApiPaging(PlaylistResponseDto, PagingParamDto)
    @ApiOperation({ summary: "Get current user's liked playlists" })
    @Get("liked-playlists")
    @UseInterceptors(new TransformDataInterceptor(PlaylistResponseDto))
    async getLikedPlaylists(
        @User("sub") id: string,
        @PagingQuery(PagingParamDto) pagingParams: PagingParamDto,
    ) {
        return this.likePlaylistService.getLikedPlaylists(id, pagingParams);
    }

    @ApiOperation({ summary: "Check if current user like a playlist or not" })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    @Head("liked-playlists/:playlistId")
    async checkLikedPlaylist(
        @User("sub") id: string,
        @Param("playlistId") playlistId: string,
    ) {
        const isLiked = await this.likePlaylistService.checkLikedPlaylist(
            id,
            playlistId,
        );

        if (!isLiked) throw new NotFoundException();
    }

    @ApiOperation({ summary: "Get current user's recommended albums (max 15)" })
    @Get("recommended-albums")
    @UseInterceptors(new TransformDataInterceptor(AlbumResponseDto))
    async getRecommendedAlbums(@User("sub") id: string) {
        const albums = await this.recommendService.getUserRecommendedAlbums(
            id,
            15,
        );

        return albums;
    }

    @ApiOperation({ summary: "Update user's profile" })
    @ApiConsumes("multipart/form-data")
    @ApiOkResponse({ type: AccountResponseDto })
    @Patch()
    @UseInterceptors(new TransformDataInterceptor(AccountResponseDto))
    @UseInterceptors(FileInterceptor("image"))
    async updateAccount(
        @User("sub") id: string,
        @Body() updateAccountDto: UpdateAccountDto,
        @UploadedFile() image: Express.Multer.File,
    ) {
        return this.cudUserService.update({
            where: { id },
            data: updateAccountDto,
            image,
        });
    }

    @ApiOperation({ summary: "Change user's password" })
    @ApiOkResponse()
    @ApiBadRequestResponse({ description: "Password does not match" })
    @Patch("password")
    async changePassword(
        @User("sub") id: string,
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        const user = await this.getUserService.findById(id);
        await this.passwordService.changePassword(user, changePasswordDto);
        return { success: true, message: "Change password successful." };
    }

    @ApiOperation({ summary: "Follow an user" })
    @ApiCreatedResponse()
    @ApiNotFoundResponse({ description: "User not found" })
    @ApiBodyId("idToFollow")
    @Post("following-users")
    async followUser(
        @User("sub") id: string,
        @Body("idToFollow", StringValidationPipe) idToFollow: string,
    ) {
        await this.followUserService.followUser(id, idToFollow);
        return { success: true };
    }

    @ApiOperation({ summary: "Unfollow an user" })
    @ApiOkResponse()
    @ApiNotFoundResponse({ description: "User not found" })
    @Delete("following-users/:idToUnFollow")
    async unFollowUser(
        @User("sub") id: string,
        @Param("idToUnFollow") idToUnFollow: string,
    ) {
        await this.followUserService.unFollowUser(id, idToUnFollow);
        return { success: true };
    }

    @ApiOperation({ summary: "Follow an artist" })
    @ApiCreatedResponse()
    @ApiNotFoundResponse({ description: "Artist not found" })
    @ApiBodyId("artistId")
    @Post("following-artists")
    async followArtist(
        @User("sub") id: string,
        @Body("artistId", StringValidationPipe) artistId: string,
    ) {
        await this.followArtistService.followArtist(id, artistId);
        return { success: true };
    }

    @ApiOperation({ summary: "Unfollow an artist" })
    @ApiOkResponse()
    @ApiNotFoundResponse({ description: "Artist not found" })
    @Delete("following-artists/:artistId")
    async unFollowArtist(
        @User("sub") id: string,
        @Param("artistId") artistId: string,
    ) {
        await this.followArtistService.unFollowArtist(id, artistId);
        return { success: true };
    }

    @ApiOperation({ summary: "Like a song" })
    @ApiCreatedResponse()
    @ApiNotFoundResponse({ description: "Song not found" })
    @ApiBodyId("songId")
    @Post("liked-songs")
    async likeSong(
        @User("sub") id: string,
        @Body("songId", StringValidationPipe) songId: string,
    ) {
        await this.likeSongService.likeSong(id, songId);
        return { success: true };
    }

    @ApiOperation({ summary: "Unlike a song" })
    @ApiOkResponse()
    @ApiNotFoundResponse({ description: "Song not found" })
    @Delete("liked-songs/:songId")
    async unlikeSong(@User("sub") id: string, @Param("songId") songId: string) {
        await this.likeSongService.unlikeSong(id, songId);
        return { success: true };
    }

    @ApiOperation({ summary: "Like an album" })
    @ApiCreatedResponse()
    @ApiNotFoundResponse({ description: "Album not found" })
    @ApiBodyId("albumId")
    @Post("liked-albums")
    async likeAlbum(
        @User("sub") id: string,
        @Body("albumId", StringValidationPipe) albumId: string,
    ) {
        await this.likeAlbumService.likeAlbum(id, albumId);
        return { success: true };
    }

    @ApiOperation({ summary: "Unlike an album" })
    @ApiOkResponse()
    @ApiNotFoundResponse({ description: "Album not found" })
    @Delete("liked-albums/:albumId")
    async unlikeAlbum(
        @User("sub") id: string,
        @Param("albumId") albumId: string,
    ) {
        await this.likeAlbumService.unlikeAlbum(id, albumId);
        return { success: true };
    }

    @ApiOperation({ summary: "Like a playlist" })
    @ApiCreatedResponse()
    @ApiNotFoundResponse({ description: "Playlist not found" })
    @ApiBodyId("playlistId")
    @Post("liked-playlists")
    async likePlaylist(
        @User("sub") id: string,
        @Body("playlistId", StringValidationPipe) playlistId: string,
    ) {
        await this.likePlaylistService.likePlaylist(id, playlistId);
        return { success: true };
    }

    @ApiOperation({ summary: "Unlike a playlist" })
    @ApiOkResponse()
    @ApiNotFoundResponse({ description: "Playlist not found" })
    @Delete("liked-playlists/:playlistId")
    async unlikePlaylist(
        @User("sub") id: string,
        @Param("playlistId") playlistId: string,
    ) {
        await this.likePlaylistService.unlikePlaylist(id, playlistId);
        return { success: true };
    }
}
