import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Inject,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConsumes,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { PagingQuery } from "src/common/decorators/paging-query.decorator";
import { ApiPaging } from "src/common/decorators/api/api-paging.decorator";
import { TransformDataInterceptor } from "src/common/interceptors/transform-data.interceptor";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { ACCESS_TOKEN } from "src/auth/constants";
import { PoliciesGuard } from "src/casl/guards/policies.guard";
import { CheckPolicies } from "src/casl/decorators/check-policies.decorator";
import { ManageAlbumHandler } from "src/casl/policies/albums/manage-album-policy.handler";
import { ALBUM_SERVICES } from "./interfaces/constants";
import { CudAlbumService } from "./interfaces/cud-album-service.interface";
import { ManageAlbumSongsService } from "./interfaces/manage-album-songs-service.interface";
import { GetAlbumService } from "./interfaces/get-album-service.interface";

import { AlbumParamDto } from "./dtos/query-params/album-param.dto";
import { CreateAlbumDto } from "./dtos/cud/create-album.dto";
import { UpdateAlbumDto } from "./dtos/cud/update-album.dto";
import { AlbumResponseDto } from "./dtos/get/album-response.dto";
import { AlbumDetailResponseDto } from "./dtos/get/album-detail-response.dto";
import { AddSongsDto } from "src/resources/albums/dtos/add-songs.dto";
import { CudAlbumResponseDto } from "./dtos/cud/cud-album-response.dto";
import { ChangeSongsOrderDto } from "./dtos/change-songs-order.dto";

@ApiTags("albums")
@Controller({
    path: "albums",
    version: "1",
})
export class AlbumsController {
    constructor(
        @Inject(ALBUM_SERVICES.CudAlbumService)
        private readonly cudAlbumService: CudAlbumService,
        @Inject(ALBUM_SERVICES.GetAlbumService)
        private readonly getAlbumService: GetAlbumService,
        @Inject(ALBUM_SERVICES.ManageAlbumSongsService)
        private readonly manageAlbumSongsService: ManageAlbumSongsService,
    ) {}

    @ApiOperation({ summary: "Get albums" })
    @ApiPaging(AlbumResponseDto, AlbumParamDto)
    @Get()
    @UseInterceptors(new TransformDataInterceptor(AlbumResponseDto))
    async getAlbums(@PagingQuery(AlbumParamDto) params: AlbumParamDto) {
        return this.getAlbumService.get(params);
    }

    @ApiOperation({ summary: "Get random albums" })
    @ApiOkResponse({ type: AlbumResponseDto, isArray: true })
    @Get("random")
    @UseInterceptors(new TransformDataInterceptor(AlbumResponseDto))
    async getRandomAlbums(
        @Query("count", new DefaultValuePipe(10), ParseIntPipe) count: number,
    ) {
        return this.getAlbumService.getRandomAlbums(count);
    }

    @ApiOperation({ summary: "Get album's detail" })
    @ApiOkResponse({ type: AlbumDetailResponseDto })
    @ApiNotFoundResponse({ description: "Album not found" })
    @Get(":id")
    @UseInterceptors(new TransformDataInterceptor(AlbumDetailResponseDto))
    async getAlbumById(@Param("id") id: string) {
        return this.getAlbumService.findByIdWithSongs(id);
    }

    @ApiOperation({ summary: "Create an album (ADMIN REQUIRED)" })
    @ApiConsumes("multipart/form-data")
    @ApiCreatedResponse({ type: CudAlbumResponseDto })
    @ApiNotFoundResponse({ description: "Genre or artist not found" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Post()
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies(ManageAlbumHandler)
    @UseInterceptors(new TransformDataInterceptor(CudAlbumResponseDto))
    @UseInterceptors(FileInterceptor("image"))
    async createAlbum(
        @Body() createAlbumDto: CreateAlbumDto,
        @UploadedFile() image: Express.Multer.File,
    ) {
        if (image) createAlbumDto.image = image;

        return this.cudAlbumService.create(createAlbumDto);
    }

    @ApiOperation({ summary: "Update an album (ADMIN REQUIRED)" })
    @ApiConsumes("multipart/form-data")
    @ApiOkResponse({ type: CudAlbumResponseDto })
    @ApiNotFoundResponse({ description: "Album or genre, artist not found" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Put(":id")
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies(ManageAlbumHandler)
    @UseInterceptors(new TransformDataInterceptor(CudAlbumResponseDto))
    @UseInterceptors(FileInterceptor("image"))
    async updateAlbum(
        @Param("id") id: string,
        @Body() updateAlbumDto: UpdateAlbumDto,
        @UploadedFile() image: Express.Multer.File,
    ) {
        if (image) updateAlbumDto.image = image;

        return this.cudAlbumService.update({
            where: { id },
            data: updateAlbumDto,
        });
    }

    @ApiOperation({ summary: "Change order of songs in album" })
    @ApiOkResponse()
    @ApiNotFoundResponse({ description: "Album not found" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Put(":id/songs/order")
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies(ManageAlbumHandler)
    async changeSongsOrder(
        @Param("id") albumId: string,
        @Body() data: ChangeSongsOrderDto,
    ) {
        await this.manageAlbumSongsService.changeSongsOrder(albumId, data.songIds);

        return { success: true };
    }

    @ApiOperation({ summary: "Add songs to album (ADMIN REQUIRED)" })
    @ApiCreatedResponse()
    @ApiNotFoundResponse({ description: "Album or song not found" })
    @ApiBadRequestResponse({ description: "Song already added to album" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Post(":id/songs")
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies(ManageAlbumHandler)
    async addSongsToAlbum(
        @Param("id") id: string,
        @Body() addSongsDto: AddSongsDto,
    ) {
        await this.manageAlbumSongsService.addSongsToAlbum(
            id,
            addSongsDto.songIds,
        );

        return { success: true };
    }

    @ApiOperation({ summary: "Remove a song from album (ADMIN REQUIRED)" })
    @ApiOkResponse()
    @ApiNotFoundResponse({ description: "Song was not found in album" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Delete(":id/songs/:songId")
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies(ManageAlbumHandler)
    async removeSongFromAlbum(
        @Param("id") id: string,
        @Param("songId") songId: string,
    ) {
        await this.manageAlbumSongsService.removeSongFromAlbum(id, songId);

        return { success: true };
    }

    @ApiOperation({ summary: "Delete an album (ADMIN REQUIRED)" })
    @ApiOkResponse({ type: CudAlbumResponseDto })
    @ApiNotFoundResponse({ description: "Album not found" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Delete(":id")
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies(ManageAlbumHandler)
    @UseInterceptors(new TransformDataInterceptor(CudAlbumResponseDto))
    async deleteAlbum(@Param("id") id: string) {
        return this.cudAlbumService.delete(id);
    }
}
