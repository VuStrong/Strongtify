import { ApiProperty } from "@nestjs/swagger";
import { Language, Song } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class CudSongResponseDto implements Song {
    @ApiProperty()
    @Expose()
    id: string;

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
    songUrl: string;

    @ApiProperty()
    @Expose()
    downloadUrl: string;

    @ApiProperty()
    @Expose()
    imageUrl: string;

    imageId: string;

    @ApiProperty()
    @Expose()
    length: number;

    @ApiProperty()
    @Expose()
    releasedAt: Date;

    @ApiProperty()
    @Expose()
    likeCount: number;

    @ApiProperty()
    @Expose()
    listenCount: number;

    @ApiProperty()
    @Expose()
    language: Language;
}
