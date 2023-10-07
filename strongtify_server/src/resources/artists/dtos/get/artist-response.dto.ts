import { ApiProperty } from "@nestjs/swagger";
import { Artist } from "@prisma/client";
import { Exclude, Expose, plainToInstance } from "class-transformer";

@Exclude()
export class ArtistResponseDto implements Artist {
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
    birthDate: Date;
    about: string;
    imageId: string;

    static toArtistResponseDto(artist: Artist | Artist[]): any {
        return plainToInstance(ArtistResponseDto, artist, {
            excludeExtraneousValues: true,
        });
    }
}
