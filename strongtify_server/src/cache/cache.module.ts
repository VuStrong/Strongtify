import { Module } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { CACHE_SERVICE } from "./interfaces/cache.interface";

@Module({
    providers: [
        {
            provide: CACHE_SERVICE,
            useClass: RedisService,
        },
    ],
    exports: [CACHE_SERVICE],
})
export class CacheModule {}
