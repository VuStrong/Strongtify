import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        if (process.env.NODE_ENV !== "production") {
            super({
                log: ["error", "info", "query", "warn"],
            });
        }
    }

    async onModuleInit() {
        await this.$connect();
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on("beforeExit", async () => {
            await app.close();
        });
    }

    /**
     * Convert text to prisma orderBy object
     * @param text - text to convert
     **/
    toPrismaOrderByObject(text: string) {
        const textSplited = text?.split("_");

        return textSplited && textSplited.length === 2
            ? { [textSplited[0]]: textSplited[1] }
            : undefined;
    }

    /**
     * Convert array of id to prisma connect object
     * @param array - array to convert
     **/
    toPrismaConnectObject(array: string[]) {
        if (!array || array.length === 0) return undefined;

        return array.map((item) => ({
            id: item,
        }));
    }
}
