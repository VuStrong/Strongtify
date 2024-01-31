import { ApiProperty } from "@nestjs/swagger";
import { Artist, Language, Song } from "@prisma/client";
import { Exclude, Expose, Transform, plainToInstance } from "class-transformer";
import { ArtistResponseDto } from "src/resources/artists/dtos/get/artist-response.dto";

@Exclude()
export class SongResponseDto implements Song {
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
    artists?: Artist[];

    static toSongResponseDto(song: Song | Song[]): any {
        return plainToInstance(SongResponseDto, song, {
            excludeExtraneousValues: true,
        });
    }
}
