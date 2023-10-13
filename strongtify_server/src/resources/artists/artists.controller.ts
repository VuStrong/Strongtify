import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Post,
    Put,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
    ApiConsumes,
    ApiOperation,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { ApiPaging } from "src/common/decorators/api/api-paging.decorator";
import { PagingQuery } from "src/common/decorators/paging-query.decorator";
import { TransformDataInterceptor } from "src/common/interceptors/transform-data.interceptor";
import { ACCESS_TOKEN } from "src/auth/constants";
import { PoliciesGuard } from "src/casl/guards/policies.guard";
import { CheckPolicies } from "src/casl/decorators/check-policies.decorator";
import { ManageArtistHandler } from "src/casl/policies/artists/manage-artist-policy.handler";
import { ARTIST_SERVICES } from "./interfaces/constants";
import { GetArtistService } from "./interfaces/get-artist-service.interface";
import { CudArtistService } from "./interfaces/cud-artist-service.interface";
import { CreateArtistDto } from "./dtos/cud/create-artist.dto";
import { QueryParamDto } from "src/common/dtos/query-param.dto";
import { ArtistResponseDto } from "./dtos/get/artist-response.dto";
import { ArtistDetailParamDto } from "./dtos/query-params/artist-detail-param.dto";
import { ArtistDetailResponseDto } from "./dtos/get/artist-detail-response.dto";
import { UpdateArtistDto } from "./dtos/cud/update-artist.dto";
import { CudArtistResponseDto } from "./dtos/cud/cud-artist-response.dto";

@ApiTags("artists")
@Controller({
    path: "artists",
    version: "1",
})
export class ArtistsController {
    constructor(
        @Inject(ARTIST_SERVICES.GetArtistService)
        private readonly getArtistService: GetArtistService,
        @Inject(ARTIST_SERVICES.CudArtistService)
        private readonly cudArtistService: CudArtistService,
    ) {}

    @ApiOperation({ summary: "Get artists" })
    @ApiPaging(ArtistResponseDto, QueryParamDto)
    @Get()
    @UseInterceptors(new TransformDataInterceptor(ArtistResponseDto))
    async getArtists(@PagingQuery(QueryParamDto) params: QueryParamDto) {
        return this.getArtistService.get(params);
    }

    @ApiOperation({ summary: "Create an artist (ADMIN REQUIRED)" })
    @ApiConsumes("multipart/form-data")
    @ApiCreatedResponse({ type: CudArtistResponseDto })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Post()
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies(ManageArtistHandler)
    @UseInterceptors(new TransformDataInterceptor(CudArtistResponseDto))
    @UseInterceptors(FileInterceptor("image"))
    async createArtist(
        @Body() createArtistDto: CreateArtistDto,
        @UploadedFile() image: Express.Multer.File,
    ) {
        if (image) createArtistDto.image = image;

        return this.cudArtistService.create(createArtistDto);
    }

    @ApiOperation({ summary: "Get artist's detail" })
    @ApiOkResponse({ type: ArtistDetailResponseDto })
    @ApiNotFoundResponse({ description: "Artist not found" })
    @Get(":id")
    @UseInterceptors(new TransformDataInterceptor(ArtistDetailResponseDto))
    async getArtistById(
        @Param("id") id: string,
        @Query() artistDetailParams: ArtistDetailParamDto,
    ) {
        return this.getArtistService.findByIdWithDetails(
            id,
            artistDetailParams,
        );
    }

    @ApiOperation({ summary: "Update an artist (ADMIN REQUIRED)" })
    @ApiConsumes("multipart/form-data")
    @ApiOkResponse({ type: CudArtistResponseDto })
    @ApiNotFoundResponse({ description: "Artist not found" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Put(":id")
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies(ManageArtistHandler)
    @UseInterceptors(FileInterceptor("image"))
    @UseInterceptors(new TransformDataInterceptor(CudArtistResponseDto))
    async updateArtist(
        @Param("id") id: string,
        @Body() updateArtistDto: UpdateArtistDto,
        @UploadedFile() image: Express.Multer.File,
    ) {
        if (image) updateArtistDto.image = image;

        return this.cudArtistService.update({
            where: { id },
            data: updateArtistDto,
        });
    }

    @ApiOperation({ summary: "Delete an artist (ADMIN REQUIRED)" })
    @ApiOkResponse({ type: CudArtistResponseDto })
    @ApiNotFoundResponse({ description: "Artist not found" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Delete(":id")
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies(ManageArtistHandler)
    @UseInterceptors(new TransformDataInterceptor(CudArtistResponseDto))
    async deleteArtist(@Param("id") id: string) {
        return this.cudArtistService.delete(id);
    }
}
