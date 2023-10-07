import { ApiProperty } from "@nestjs/swagger";
import { Playlist, PlaylistStatus, User } from "@prisma/client";
import { Exclude, Expose, Transform, plainToInstance } from "class-transformer";
import { UserResponseDto } from "src/resources/users/dtos/get/user-response.dto";

@Exclude()
export class PlaylistResponseDto implements Playlist {
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
    user?: User;

    @ApiProperty()
    @Expose()
    status: PlaylistStatus;

    static toPlaylistResponseDto(playlist: Playlist | Playlist[]): any {
        return plainToInstance(PlaylistResponseDto, playlist, {
            excludeExtraneousValues: true,
        });
    }
}
