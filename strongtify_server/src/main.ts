import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ACCESS_TOKEN } from "./auth/constants";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableVersioning({
        type: VersioningType.URI,
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    // swagger
    const swaggerConfig = new DocumentBuilder()
        .setTitle("Strongtify API")
        .setDescription("API document for Strongtify")
        .setVersion("1.0")
        .addTag("strongtify")
        .addBearerAuth(
            {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
            ACCESS_TOKEN,
        )
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api", app, document);

    app.enableCors({
        origin: "*",
        methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
    });

    await app.listen(process.env.PORT || 3000);
}

bootstrap();
