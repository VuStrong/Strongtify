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
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
    ApiConsumes,
    ApiCreatedResponse,
    ApiBearerAuth,
    ApiOperation,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { TransformDataInterceptor } from "src/common/interceptors/transform-data.interceptor";
import { ACCESS_TOKEN } from "src/auth/constants";
import { PoliciesGuard } from "src/casl/guards/policies.guard";
import { CheckPolicies } from "src/casl/decorators/check-policies.decorator";
import { ManageGenreHandler } from "src/casl/policies/genres/manage-genre-policy.handler";

import { CreateGenreDto } from "./dtos/cud/create-genre.dto";
import { GenreDetailResponseDto } from "./dtos/get/genre-detail-response.dto";
import { GenreDetailParamDto } from "./dtos/query-params/genre-detail-param.dto";
import { GENRE_SERVICES } from "./interfaces/constants";
import { GetGenreService } from "./interfaces/get-genre-service.interface";
import { CudGenreService } from "./interfaces/cud-genre-service.interface";
import { GenreResponseDto } from "./dtos/get/genre-response.dto";
import { UpdateGenreDto } from "./dtos/cud/update-genre.dto";
import { CudGenreResponseDto } from "./dtos/cud/cud-genre-response.dto";
import { ApiPaging } from "src/common/decorators/api/api-paging.decorator";
import { QueryParamDto } from "src/common/dtos/query-param.dto";
import { PagingQuery } from "src/common/decorators/paging-query.decorator";

@ApiTags("genres")
@Controller({
    path: "genres",
    version: "1",
})
export class GenresController {
    constructor(
        @Inject(GENRE_SERVICES.GetGenreService)
        private readonly getGenreService: GetGenreService,
        @Inject(GENRE_SERVICES.CudGenreService)
        private readonly cudGenreService: CudGenreService,
    ) {}

    @ApiOperation({ summary: "Get genres" })
    @ApiPaging(GenreResponseDto, QueryParamDto)
    @Get()
    @UseInterceptors(new TransformDataInterceptor(GenreResponseDto))
    async getGenres(@PagingQuery(QueryParamDto) params: QueryParamDto) {
        return this.getGenreService.get(params);
    }

    @ApiOperation({ summary: "Get genre's detail" })
    @ApiOkResponse({ type: GenreDetailResponseDto })
    @ApiNotFoundResponse({ description: "Genre not found." })
    @Get(":id")
    @UseInterceptors(new TransformDataInterceptor(GenreDetailResponseDto))
    async getGenreById(
        @Param("id") id: string,
        @Query() params: GenreDetailParamDto,
    ) {
        return this.getGenreService.findByIdWithDetails(id, params);
    }

    @ApiOperation({ summary: "Create a genre (ADMIN REQUIRED)" })
    @ApiConsumes("multipart/form-data")
    @ApiCreatedResponse({ type: CudGenreResponseDto })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Post()
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies(ManageGenreHandler)
    @UseInterceptors(FileInterceptor("image"))
    @UseInterceptors(new TransformDataInterceptor(CudGenreResponseDto))
    async createGenre(
        @Body() createGenreDto: CreateGenreDto,
        @UploadedFile() image: Express.Multer.File,
    ) {
        if (image) createGenreDto.image = image;

        return this.cudGenreService.create(createGenreDto);
    }

    @ApiOperation({ summary: "Update a genre (ADMIN REQUIRED)" })
    @ApiConsumes("multipart/form-data")
    @ApiOkResponse({ type: CudGenreResponseDto })
    @ApiNotFoundResponse({ description: "Genre not found" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Put(":id")
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies(ManageGenreHandler)
    @UseInterceptors(FileInterceptor("image"))
    @UseInterceptors(new TransformDataInterceptor(CudGenreResponseDto))
    async updateGenre(
        @Param("id") id: string,
        @Body() updateGenreDto: UpdateGenreDto,
        @UploadedFile() image: Express.Multer.File,
    ) {
        if (image) updateGenreDto.image = image;

        return this.cudGenreService.update({
            where: { id },
            data: updateGenreDto,
        });
    }

    @ApiOperation({ summary: "Delete a genre (ADMIN REQUIRED)" })
    @ApiOkResponse({ type: CudGenreResponseDto })
    @ApiNotFoundResponse({ description: "Genre not found" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Delete(":id")
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies(ManageGenreHandler)
    @UseInterceptors(new TransformDataInterceptor(CudGenreResponseDto))
    async deleteGenre(@Param("id") id: string) {
        return this.cudGenreService.delete(id);
    }
}
