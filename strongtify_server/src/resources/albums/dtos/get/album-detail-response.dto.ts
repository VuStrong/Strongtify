import { Album, AlbumSong, Artist, Genre } from "@prisma/client";
import { Exclude, Expose, Transform, plainToInstance } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { ArtistResponseDto } from "src/resources/artists/dtos/get/artist-response.dto";
import { SongResponseDto } from "src/resources/songs/dtos/get/song-response.dto";
import { GenreResponseDto } from "src/resources/genres/dtos/get/genre-response.dto";

@Exclude()
export class AlbumDetailResponseDto implements Album {
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
    artist: Artist;

    @ApiProperty({
        isArray: true,
        type: GenreResponseDto,
    })
    @Expose()
    @Transform(({ value }) => GenreResponseDto.toGenreResponseDto(value))
    genres: Genre[];

    @ApiProperty({
        isArray: true,
        type: SongResponseDto,
    })
    @Expose()
    @Transform(({ value }) =>
        plainToInstance(
            SongResponseDto,
            value?.map((v) => v.song),
        ),
    )
    songs: AlbumSong[];
}
