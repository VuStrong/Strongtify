import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import * as streamifier from "streamifier";
import {
    UploadOptions,
    UploadResponse,
    UploadService,
} from "./interfaces/upload.interface";

@Injectable()
export class CloudinaryService implements UploadService {
    async uploadFile(
        file: Express.Multer.File,
        options?: UploadOptions,
    ): Promise<UploadResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: options?.folder,
                },
                (error, result) => {
                    if (error) return reject(error);

                    resolve({
                        fileId: result.public_id,
                        url: result.url,
                    });
                },
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    async deleteFile(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(id, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    }
}
