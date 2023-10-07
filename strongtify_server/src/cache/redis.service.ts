import { Injectable, OnModuleInit } from "@nestjs/common";
import { RedisClientType, createClient } from "redis";
import { CacheService } from "./interfaces/cache.interface";

@Injectable()
export class RedisService implements OnModuleInit, CacheService {
    private client: RedisClientType;

    async onModuleInit() {
        this.client = createClient({
            url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        });

        this.client.on("error", (err) =>
            console.log("Redis Client Error: ", err),
        );

        await this.client.connect();
    }

    async get(key: string) {
        try {
            return JSON.parse(await this.client.get(key));
        } catch (error) {
            return undefined;
        }
    }

    async set(key: string, value: string, expire = 60 * 60 * 12) {
        try {
            await this.client.set(key, value, {
                EX: expire,
            });
        } catch (error) {}
    }

    async delete(key: string): Promise<void> {
        try {
            await this.client.del(key);
        } catch (error) {}
    }
}
