import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Inject,
    Param,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
    ApiConsumes,
    ApiCreatedResponse,
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiOperation,
    ApiBadRequestResponse,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

import { ApiPaging } from "src/common/decorators/api/api-paging.decorator";
import { TransformDataInterceptor } from "src/common/interceptors/transform-data.interceptor";
import { PagingQuery } from "src/common/decorators/paging-query.decorator";
import { User } from "../users/decorators/user.decorator";

import { ACCESS_TOKEN } from "src/auth/constants";
import { AuthGuard } from "src/auth/guards/auth.guard";

import { PlaylistParamDto } from "./dtos/query-params/playlist-param.dto";
import { PlaylistDetailResponseDto } from "./dtos/get/playlist-detail-response.dto";
import { CreatePlaylistDto } from "./dtos/cud/create-playlist.dto";
import { AddSongsDto } from "./dtos/add-songs.dto";
import { UpdatePlaylistDto } from "./dtos/cud/update-playlist.dto";
import { PlaylistResponseDto } from "./dtos/get/playlist-response.dto";
import { CudPlaylistResponseDto } from "./dtos/cud/cud-playlist-response.dto";

import { CaslAbilityFactory } from "src/casl/casl-ability.factory";
import { Action } from "src/casl/enums/casl.enum";
import { subject } from "@casl/ability";
import { PoliciesGuard } from "src/casl/guards/policies.guard";
import { CheckPolicies } from "src/casl/decorators/check-policies.decorator";
import { UpdatePlaylistHandler } from "src/casl/policies/playlists/update-playlist-policy.handler";
import { DeletePlaylistHandler } from "src/casl/policies/playlists/delete-playlist-policy.handler";
import { PLAYLIST_SERVICES } from "./interfaces/constants";
import { GetPlaylistService } from "./interfaces/get-playlist-service.interface";
import { CudPlaylistService } from "./interfaces/cud-playlist-service.interface";
import { ManagePlaylistSongsService } from "./interfaces/manage-playlist-songs-service.interface";
import { JwtPayload } from "src/auth/types/jwt-payload";
import { ChangeSongsOrderDto } from "./dtos/change-songs-order.dto";

@ApiTags("playlists")
@Controller({
    path: "playlists",
    version: "1",
})
export class PlaylistsController {
    constructor(
        private readonly caslAbilityFactory: CaslAbilityFactory,
        @Inject(PLAYLIST_SERVICES.GetPlaylistService)
        private readonly getPlaylistService: GetPlaylistService,
        @Inject(PLAYLIST_SERVICES.CudPlaylistService)
        private readonly cudPlaylistService: CudPlaylistService,
        @Inject(PLAYLIST_SERVICES.ManagePlaylistSongsService)
        private readonly managePlaylistSongsService: ManagePlaylistSongsService,
    ) {}

    @ApiOperation({
        summary:
            "Get public playlists (include private playlists of current user or all if is ADMIN)",
    })
    @ApiBearerAuth(ACCESS_TOKEN)
    @ApiPaging(PlaylistResponseDto, PlaylistParamDto)
    @Get()
    @UseInterceptors(new TransformDataInterceptor(PlaylistResponseDto))
    async getPlaylists(
        @User() user: JwtPayload,
        @PagingQuery(PlaylistParamDto) params: PlaylistParamDto,
    ) {
        params.restrictOptions = {
            restrict: true,
            userIdToRestrict: user?.sub
        }

        if (user?.role === "ADMIN") {
            params.restrictOptions.restrict = false;
        }

        return this.getPlaylistService.get(params);
    }

    @ApiOperation({ summary: "Get playlist's detail" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @ApiOkResponse({ type: PlaylistDetailResponseDto })
    @ApiNotFoundResponse({ description: "Playlist not found" })
    @ApiForbiddenResponse({
        description: "Private playlist not belong to user",
    })
    @Get(":id")
    @UseInterceptors(new TransformDataInterceptor(PlaylistDetailResponseDto))
    async getPlaylistById(@Param("id") id: string, @User() user: any) {
        const playlist = await this.getPlaylistService.findByIdWithSongs(id);

        const ability = this.caslAbilityFactory.createForUser(user);

        if (!ability.can(Action.Read, subject("Playlist", playlist))) {
            throw new ForbiddenException("Private playlist not belong to user");
        }

        return playlist;
    }

    @ApiOperation({ summary: "Create a playlist" })
    @ApiConsumes("multipart/form-data")
    @ApiCreatedResponse({ type: CudPlaylistResponseDto })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Post()
    @UseGuards(AuthGuard)
    @UseInterceptors(new TransformDataInterceptor(CudPlaylistResponseDto))
    @UseInterceptors(FileInterceptor("image"))
    async createPlaylist(
        @Body() createPlaylistDto: CreatePlaylistDto,
        @User("sub") userId: string,
        @UploadedFile() image: Express.Multer.File,
    ) {
        createPlaylistDto.userId = userId;

        if (image) createPlaylistDto.image = image;

        return this.cudPlaylistService.create(createPlaylistDto);
    }

    @ApiOperation({ summary: "Update a playlist" })
    @ApiConsumes("multipart/form-data")
    @ApiOkResponse({ type: CudPlaylistResponseDto })
    @ApiNotFoundResponse({ description: "Playlist not found" })
    @ApiForbiddenResponse({ description: "Playlist not belong to user" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Put(":id")
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies(UpdatePlaylistHandler)
    @UseInterceptors(new TransformDataInterceptor(CudPlaylistResponseDto))
    @UseInterceptors(FileInterceptor("image"))
    async updatePlaylist(
        @Param("id") id: string,
        @Body() updatePlaylistDto: UpdatePlaylistDto,
        @UploadedFile() image: Express.Multer.File,
    ) {
        if (image) updatePlaylistDto.image = image;

        return this.cudPlaylistService.update({
            where: { id },
            data: updatePlaylistDto,
        });
    }

    @ApiOperation({ summary: "Change order of songs in playlist" })
    @ApiOkResponse()
    @ApiNotFoundResponse({ description: "Playlist not found" })
    @ApiForbiddenResponse({ description: "Playlist not belong to user" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Put(":id/songs/order")
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies(UpdatePlaylistHandler)
    async changeSongsOrder(
        @Param("id") id: string,
        @Body() data: ChangeSongsOrderDto,
    ) {
        await this.managePlaylistSongsService.changeSongsOrder(id, data.songIds);
        
        return { success: true };
    }

    @ApiOperation({ summary: "Add songs to playlist" })
    @ApiCreatedResponse()
    @ApiNotFoundResponse({ description: "Playlist or song not found" })
    @ApiForbiddenResponse({ description: "Playlist not belong to user" })
    @ApiBadRequestResponse({ description: "Song already added to playlist" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Post(":id/songs")
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies(UpdatePlaylistHandler)
    async addSongsToPlaylist(
        @Param("id") id: string,
        @Body() addSongsDto: AddSongsDto,
    ) {
        await this.managePlaylistSongsService.addSongsToPlaylist(
            id,
            addSongsDto.songIds,
        );

        return { success: true };
    }

    @ApiOperation({ summary: "Remove a song from playlist" })
    @ApiOkResponse()
    @ApiNotFoundResponse({ description: "Playlist or song not found" })
    @ApiForbiddenResponse({ description: "Playlist not belong to user" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Delete(":id/songs/:songId")
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies(UpdatePlaylistHandler)
    async removeSongFromPlaylist(
        @Param("id") id: string,
        @Param("songId") songId: string,
    ) {
        await this.managePlaylistSongsService.removeSongFromPlaylist(
            id,
            songId,
        );

        return { success: true };
    }

    @ApiOperation({ summary: "Delete a playlist" })
    @ApiOkResponse({ type: CudPlaylistResponseDto })
    @ApiNotFoundResponse({ description: "Playlist not found" })
    @ApiForbiddenResponse({ description: "Playlist not belong to user" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Delete(":id")
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies(DeletePlaylistHandler)
    @UseInterceptors(new TransformDataInterceptor(CudPlaylistResponseDto))
    async deletePlaylist(@Param("id") id: string) {
        return this.cudPlaylistService.delete(id);
    }
}
