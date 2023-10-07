import {
    Controller,
    ForbiddenException,
    Get,
    Inject,
    Query,
} from "@nestjs/common";
import {
    ApiExcludeController
} from "@nestjs/swagger";
import { CACHE_SERVICE, CacheService } from "./cache/interfaces/cache.interface";

@ApiExcludeController()
@Controller({
    path: "ffapi",
})
/** 
 * Some API for fun 
 */
export class FFApiController {
    constructor(
        @Inject(CACHE_SERVICE) private readonly cacheService: CacheService,
    ) {}

    @Get("today")
    async today() {
        return new Date().toISOString().split("T")[0];
    }

    @Get("del-sections")
    async deleteCachedSections(@Query("pass") pass: string) {
        if (pass !== process.env.FFAPI_PASS) throw new ForbiddenException();

        await this.cacheService.delete("cached-sections");
    }
}
