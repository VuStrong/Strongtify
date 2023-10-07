import { ApiProperty } from "@nestjs/swagger";
import { Gender, Role, User } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class AccountResponseDto implements User {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    updatedAt: Date;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    alias: string;

    @ApiProperty()
    @Expose()
    email: string;

    hashedPassword: string;

    @ApiProperty()
    @Expose()
    imageUrl: string;

    imageId: string;

    @ApiProperty()
    @Expose()
    emailConfirmed: boolean;

    @ApiProperty()
    @Expose()
    locked: boolean;

    @ApiProperty()
    @Expose()
    role: Role;

    @ApiProperty()
    @Expose()
    followerCount: number;

    @ApiProperty()
    @Expose()
    birthDate: Date;

    @ApiProperty()
    @Expose()
    gender: Gender;

    @ApiProperty()
    @Expose()
    about: string;
}
