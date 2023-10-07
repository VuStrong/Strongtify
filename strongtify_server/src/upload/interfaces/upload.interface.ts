export type UploadOptions = {
    folder?: string;
};

export type UploadResponse = {
    fileId: string;
    url: string;
};

export const UPLOAD_SERVICE = "UploadService";

export interface UploadService {
    uploadFile(
        file: Express.Multer.File,
        options?: UploadOptions,
    ): Promise<UploadResponse>;

    deleteFile(id: string): Promise<void>;
}
