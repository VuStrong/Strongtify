import { ApiProperty } from "@nestjs/swagger";
import { Album, Artist, Song } from "@prisma/client";
import { Exclude, Expose, Transform } from "class-transformer";
import { AlbumResponseDto } from "src/resources/albums/dtos/get/album-response.dto";
import { SongResponseDto } from "src/resources/songs/dtos/get/song-response.dto";

@Exclude()
export class ArtistDetailResponseDto implements Artist {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    alias: string;

    @ApiProperty()
    @Expose()
    birthDate: Date;

    @ApiProperty()
    @Expose()
    about: string;

    @ApiProperty()
    @Expose()
    imageUrl: string;

    imageId: string;

    @ApiProperty()
    @Expose()
    followerCount: number;

    @ApiProperty()
    @Expose()
    songCount: number;

    @ApiProperty()
    @Expose()
    albumCount: number;

    _count?: any;

    @ApiProperty({
        type: SongResponseDto,
        isArray: true,
    })
    @Expose()
    @Transform(({ value }) => SongResponseDto.toSongResponseDto(value))
    songs?: Song[];

    @ApiProperty({
        type: AlbumResponseDto,
        isArray: true,
    })
    @Expose()
    @Transform(({ value }) => AlbumResponseDto.toAlbumResponseDto(value))
    albums?: Album[];
}
