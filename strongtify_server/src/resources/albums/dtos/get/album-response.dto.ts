import { Album, Artist } from "@prisma/client";
import { Exclude, Expose, Transform, plainToInstance } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { ArtistResponseDto } from "src/resources/artists/dtos/get/artist-response.dto";

@Exclude()
export class AlbumResponseDto implements Album {
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
    imageUrl: string;

    imageId: string;

    @ApiProperty()
    @Expose()
    likeCount: number;

    @ApiProperty()
    @Expose()
    songCount: number;

    @ApiProperty()
    @Expose()
    totalLength: number;

    artistId: string;

    @ApiProperty({ type: ArtistResponseDto })
    @Expose()
    @Transform(({ value }) => ArtistResponseDto.toArtistResponseDto(value))
    artist?: Artist;

    static toAlbumResponseDto(album: Album | Album[]): any {
        return plainToInstance(AlbumResponseDto, album, {
            excludeExtraneousValues: true,
        });
    }
}
