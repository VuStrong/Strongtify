import { ApiProperty } from "@nestjs/swagger";
import { Album, Genre, Song } from "@prisma/client";
import { Exclude, Expose, Transform } from "class-transformer";
import { AlbumResponseDto } from "src/resources/albums/dtos/get/album-response.dto";
import { SongResponseDto } from "src/resources/songs/dtos/get/song-response.dto";

@Exclude()
export class GenreDetailResponseDto implements Genre {
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
    alias: string;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    description: string;

    @ApiProperty()
    @Expose()
    imageUrl: string;

    imageId: string;

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
