import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Inject,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
    ApiBearerAuth,
    ApiConsumes,
    ApiOperation,
} from "@nestjs/swagger";
import { Request } from "express";

import { AuthGuard } from "src/auth/guards/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { PagingQuery } from "src/common/decorators/paging-query.decorator";
import { TransformDataInterceptor } from "src/common/interceptors/transform-data.interceptor";

import { CreateSongDto } from "./dtos/cud/create-song.dto";
import { UpdateSongDto } from "./dtos/cud/update-song.dto";
import { SongResponseDto } from "./dtos/get/song-response.dto";
import { ApiPaging } from "src/common/decorators/api/api-paging.decorator";
import { ACCESS_TOKEN } from "src/auth/constants";
import { SongParamDto } from "./dtos/query-params/song-param.dto";
import { TopSongsParamDto } from "./dtos/query-params/top-songs-param.dto";
import { TopSongResponseDto } from "./dtos/get/top-song-response.dto";
import { SongDetailResponseDto } from "./dtos/get/song-detail-response.dto";
import { PoliciesGuard } from "src/casl/guards/policies.guard";
import { CheckPolicies } from "src/casl/decorators/check-policies.decorator";
import { ManageSongHandler } from "src/casl/policies/songs/manage-song-policy.handler";
import { SONG_SERVICES } from "./interfaces/constants";
import { GetSongService } from "./interfaces/get-song-service.interface";
import { CudSongService } from "./interfaces/cud-song-service.interface";
import { SongListenService } from "./interfaces/song-listen-service.interface";
import { StatisticSongService } from "./interfaces/statistic-song-service.interface";
import { CudSongResponseDto } from "./dtos/cud/cud-song-response.dto";
import { User } from "../users/decorators/user.decorator";

@ApiTags("songs")
@Controller({
    path: "songs",
    version: "1",
})
export class SongsController {
    constructor(
        @Inject(SONG_SERVICES.GetSongService)
        private readonly getSongService: GetSongService,
        @Inject(SONG_SERVICES.CudSongService)
        private readonly cudSongService: CudSongService,
        @Inject(SONG_SERVICES.SongListenService)
        private readonly songListenService: SongListenService,
        @Inject(SONG_SERVICES.StatisticSongService)
        private readonly statisticSongService: StatisticSongService,
    ) {}

    @ApiOperation({ summary: "Get songs" })
    @ApiPaging(SongResponseDto, SongParamDto)
    @Get()
    @UseInterceptors(new TransformDataInterceptor(SongResponseDto))
    async getSongs(@PagingQuery(SongParamDto) params: SongParamDto) {
        return this.getSongService.get(params);
    }

    @ApiOperation({
        summary: "Get top songs sort by listen count in a time range",
    })
    @ApiOkResponse({ isArray: true, type: TopSongResponseDto })
    @Get("/top-songs")
    @UseInterceptors(new TransformDataInterceptor(TopSongResponseDto))
    async getTopSongs(@Query() params: TopSongsParamDto) {
        return this.statisticSongService.getTopSongs(params);
    }

    @ApiOperation({ summary: "Get random songs" })
    @ApiOkResponse({ type: SongResponseDto, isArray: true })
    @Get("random")
    @UseInterceptors(new TransformDataInterceptor(SongResponseDto))
    async getRandomSongs(
        @Query("count", new DefaultValuePipe(10), ParseIntPipe) count: number,
    ) {
        return this.getSongService.getRandomSongs(count);
    }

    @ApiOperation({ summary: "Create new song (ADMIN REQUIRED)" })
    @ApiConsumes("multipart/form-data")
    @ApiCreatedResponse({ type: CudSongResponseDto })
    @ApiNotFoundResponse({ description: "Artist or genre was not found" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Post()
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies(ManageSongHandler)
    @UseInterceptors(FileInterceptor("image"))
    @UseInterceptors(new TransformDataInterceptor(CudSongResponseDto))
    async createSong(
        @Body() createSongDto: CreateSongDto,
        @UploadedFile() image: Express.Multer.File,
    ) {
        if (image) createSongDto.image = image;

        return this.cudSongService.create(createSongDto);
    }

    @ApiOperation({ summary: "Increase listen count of a song" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @ApiOkResponse()
    @ApiNotFoundResponse({ description: "Song not found" })
    @Patch(":id/listen")
    async increaseListenCount(
        @Param("id") id: string,
        @User("sub") userId: string,
        @Req() req: Request,
    ) {
        await this.songListenService.increaseListenCount(id, {
            userId,
            ip:
                req.header("cf-connecting-ip") ||
                req.header("X-Real-IP") ||
                req.headers["x-forwarded-for"]?.[0],
        });

        return { success: true };
    }

    @ApiOperation({ summary: "Get a song by ID" })
    @ApiOkResponse({ type: SongDetailResponseDto })
    @ApiNotFoundResponse({ description: "Song not found" })
    @Get(":id")
    @UseInterceptors(new TransformDataInterceptor(SongDetailResponseDto))
    async getSongById(@Param("id") id: string) {
        return this.getSongService.findByIdWithDetails(id);
    }

    @ApiOperation({ summary: "Update song (ADMIN REQUIRED)" })
    @ApiConsumes("multipart/form-data")
    @ApiOkResponse({ type: CudSongResponseDto })
    @ApiNotFoundResponse({ description: "Song or artist, genre was not found" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Put(":id")
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies(ManageSongHandler)
    @UseInterceptors(FileInterceptor("image"))
    @UseInterceptors(new TransformDataInterceptor(CudSongResponseDto))
    async updateSong(
        @Param("id") id: string,
        @Body() updateSongDto: UpdateSongDto,
        @UploadedFile() image: Express.Multer.File,
    ) {
        if (image) updateSongDto.image = image;

        return this.cudSongService.update({
            where: { id },
            data: updateSongDto,
        });
    }

    @ApiOperation({ summary: "Delete song (ADMIN REQUIRED)" })
    @ApiOkResponse({ type: CudSongResponseDto })
    @ApiNotFoundResponse({ description: "Song not found" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Delete(":id")
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies(ManageSongHandler)
    @UseInterceptors(new TransformDataInterceptor(CudSongResponseDto))
    async deleteSong(@Param("id") id: string) {
        return this.cudSongService.delete(id);
    }
}
