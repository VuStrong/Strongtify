import { ApiProperty } from "@nestjs/swagger";
import { Song } from "@prisma/client";
import { Exclude, Expose, plainToInstance, Transform } from "class-transformer";
import { SongResponseDto } from "src/resources/songs/dtos/get/song-response.dto";

@Exclude()
export class ListenDto {
    @ApiProperty({ type: SongResponseDto })
    @Expose()
    @Transform(({ value }) => SongResponseDto.toSongResponseDto(value))
    song: Song;

    @ApiProperty()
    @Expose()
    at: Date;

    @ApiProperty()
    @Expose()
    userId?: string;

    @ApiProperty()
    @Expose()
    ip?: string;
}

@Exclude()
export class AdminWebStatDto {
    @ApiProperty()
    @Expose()
    newUserTodayCount: number;

    @ApiProperty()
    @Expose()
    newPlaylistTodayCount: number;

    @ApiProperty({ type: ListenDto, isArray: true })
    @Expose()
    @Transform(({ value }) => plainToInstance(ListenDto, value))
    recentListens: ListenDto[];
}