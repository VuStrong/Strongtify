import { ApiProperty } from "@nestjs/swagger";
import { Artist } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class CudArtistResponseDto implements Artist {
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

    @ApiProperty()
    @Expose()
    birthDate: Date;

    @ApiProperty()
    @Expose()
    about: string;

    imageId: string;
}
