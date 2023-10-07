import {
    Inject,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { CudUserService } from "../interfaces/cud-user-service.interface";
import { PrismaService } from "src/database/prisma.service";
import {
    UPLOAD_SERVICE,
    UploadService,
} from "src/upload/interfaces/upload.interface";
import { StringService } from "src/common/utils/string.service";
import { UserNotFoundException } from "../exceptions/user-not-found.exception";
import { PrismaError } from "src/database/enums/prisma-error.enum";
import { Prisma, User } from "@prisma/client";
import { UploadFolder } from "src/upload/enums/folder.enum";

@Injectable()
export class CudUserServiceImpl implements CudUserService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(UPLOAD_SERVICE) private readonly uploadService: UploadService,
        private readonly stringService: StringService,
    ) {}

    async create(data: Prisma.UserCreateInput): Promise<User> {
        data.alias = this.stringService.slug(data.name);
        return this.prisma.user.create({ data });
    }

    async update(params: {
        data: Prisma.UserUpdateInput;
        where: Prisma.UserWhereUniqueInput;
        image?: Express.Multer.File;
    }): Promise<User> {
        const { data, where, image } = params;
        if (data.name)
            data.alias = this.stringService.slug(data.name as string);

        // if not upload image, then no need to query old user to compare later
        const oldUser =
            image &&
            (await this.prisma.user
                .findUniqueOrThrow({
                    where,
                    select: { imageId: true },
                })
                .catch(() => {
                    throw new UserNotFoundException();
                }));

        // upload image
        const uploadResponse =
            image &&
            (await this.uploadService
                .uploadFile(image, {
                    folder: UploadFolder.USER_IMAGE,
                })
                .catch(() => undefined));

        data.imageId = uploadResponse?.fileId;
        data.imageUrl = uploadResponse?.url;

        const updatedUser = await this.prisma.user
            .update({
                data,
                where,
            })
            .catch((error) => {
                // if user can not update, delete the image created
                if (uploadResponse)
                    this.uploadService.deleteFile(uploadResponse.fileId);

                if (
                    error?.code === PrismaError.ENTITY_NOT_FOUND ||
                    error?.code === PrismaError.QUERY_INTERPRETATION_ERROR
                ) {
                    throw new UserNotFoundException();
                } else {
                    throw new InternalServerErrorException();
                }
            });

        // if user updated, delete the old image if it exist
        if (oldUser?.imageId && updatedUser.imageId !== oldUser.imageId)
            this.uploadService.deleteFile(oldUser.imageId);

        return updatedUser;
    }

    async delete(id: string): Promise<User> {
        const user = await this.prisma.user
            .delete({ where: { id } })
            .catch((error) => {
                if (error?.code === PrismaError.ENTITY_NOT_FOUND) {
                    throw new UserNotFoundException();
                } else {
                    throw new InternalServerErrorException();
                }
            });

        // if user have an image, delete it
        if (user.imageId) this.uploadService.deleteFile(user.imageId);

        return user;
    }
}
