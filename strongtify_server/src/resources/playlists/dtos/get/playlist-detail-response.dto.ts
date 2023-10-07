import { ApiProperty } from "@nestjs/swagger";
import { Playlist, PlaylistSong, PlaylistStatus, User } from "@prisma/client";
import { Exclude, Expose, Transform, plainToInstance } from "class-transformer";
import { UserResponseDto } from "src/resources/users/dtos/get/user-response.dto";
import { SongResponseDto } from "src/resources/songs/dtos/get/song-response.dto";

@Exclude()
export class PlaylistDetailResponseDto implements Playlist {
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
    description: string;

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

    userId: string;

    @ApiProperty({ type: UserResponseDto })
    @Expose()
    @Transform(({ value }) => UserResponseDto.toUserResponseDto(value))
    user: User;

    @ApiProperty()
    @Expose()
    status: PlaylistStatus;

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
    songs: PlaylistSong[];
}
