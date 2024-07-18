import {
    Controller,
    DefaultValuePipe,
    Get,
    ParseBoolPipe,
    ParseIntPipe,
    Query,
    UseInterceptors,
} from "@nestjs/common";
import { AppService } from "./app.service";
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
} from "@nestjs/swagger";
import { TransformDataInterceptor } from "./common/interceptors/transform-data.interceptor";
import { SearchResponseDto } from "./common/dtos/search-response.dto";
import { ACCESS_TOKEN } from "./auth/constants";
import { Section } from "./section/section.dto";

@ApiTags("")
@Controller({
    path: "",
    version: "1",
})
export class AppController {
    constructor(private readonly appService: AppService) {}

    @ApiOperation({ summary: "Get sections for the home page" })
    @ApiBearerAuth(ACCESS_TOKEN)
    @ApiOkResponse({ type: Section, isArray: true })
    @Get("/sections")
    async getSections() {
        return this.appService.getSections();
    }

    @ApiOperation({ summary: "Search resources" })
    @ApiQuery({
        name: "q",
        required: false,
        description: "Keyword to search",
    })
    @ApiQuery({ name: "take", required: false })
    @ApiQuery({
        name: "allowCount",
        required: false,
        description:
            "If true, allow count total of data searched (default: false)",
    })
    @ApiOkResponse({ type: SearchResponseDto })
    @Get("/search")
    @UseInterceptors(new TransformDataInterceptor(SearchResponseDto))
    async search(
        @Query("q") keyword: string,
        @Query("take", new DefaultValuePipe(5), ParseIntPipe) take: number,
        @Query("allowCount", new DefaultValuePipe(false), ParseBoolPipe)
        allowCount: boolean,
    ) {
        return this.appService.search(keyword, { take, allowCount });
    }
}
