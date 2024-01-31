import { ApiProperty } from "@nestjs/swagger";
import { Artist, Genre, Language, Song } from "@prisma/client";
import { Exclude, Expose, Transform } from "class-transformer";
import { ArtistResponseDto } from "src/resources/artists/dtos/get/artist-response.dto";
import { GenreResponseDto } from "src/resources/genres/dtos/get/genre-response.dto";

@Exclude()
export class SongDetailResponseDto implements Song {
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

    @ApiProperty({
        isArray: true,
        type: ArtistResponseDto,
    })
    @Transform(({ value }) => ArtistResponseDto.toArtistResponseDto(value))
    @Expose()
    artists: Artist[];

    @ApiProperty({
        isArray: true,
        type: GenreResponseDto,
    })
    @Transform(({ value }) => GenreResponseDto.toGenreResponseDto(value))
    @Expose()
    genres: Genre[];
}
