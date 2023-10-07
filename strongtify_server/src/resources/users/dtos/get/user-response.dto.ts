import { ApiProperty } from "@nestjs/swagger";
import { Gender, Role, User } from "@prisma/client";
import { Exclude, Expose, plainToInstance } from "class-transformer";

@Exclude()
export class UserResponseDto implements User {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    alias: string;

    @ApiProperty()
    @Expose()
    imageUrl: string;

    @ApiProperty()
    @Expose()
    followerCount: number;

    createdAt: Date;
    updatedAt: Date;
    email: string;
    hashedPassword: string;
    imageId: string;
    emailConfirmed: boolean;
    locked: boolean;
    role: Role;
    birthDate: Date;
    gender: Gender;
    about: string;

    static toUserResponseDto(user: User | User[]): any {
        return plainToInstance(UserResponseDto, user, {
            excludeExtraneousValues: true,
        });
    }
}
