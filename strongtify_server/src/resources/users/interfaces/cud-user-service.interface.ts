import { Prisma, User } from "@prisma/client";

/**
 * Interface for User to perform CUD operations (Create, Update, Delete)
 */
export interface CudUserService {
    create(data: Prisma.UserCreateInput): Promise<User>;

    update(params: {
        data: Prisma.UserUpdateInput;
        where: Prisma.UserWhereUniqueInput;
        image?: Express.Multer.File;
    }): Promise<User>;

    delete(id: string): Promise<User>;
}
