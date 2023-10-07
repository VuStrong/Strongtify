import { Module } from "@nestjs/common";
import { CloudinaryProvider } from "./providers/cloudinary.provider";
import { UPLOAD_SERVICE } from "./interfaces/upload.interface";
import { CloudinaryService } from "./cloudinary.service";

@Module({
    providers: [
        CloudinaryProvider,
        {
            provide: UPLOAD_SERVICE,
            useClass: CloudinaryService,
        },
    ],
    exports: [UPLOAD_SERVICE, CloudinaryProvider],
})
export class UploadModule {}
