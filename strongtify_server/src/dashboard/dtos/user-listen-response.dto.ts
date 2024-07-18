import { ApiProperty } from "@nestjs/swagger";
import { Song, User, UserListen } from "@prisma/client";
import { Exclude, Expose, Transform } from "class-transformer";
import { SongResponseDto } from "src/resources/songs/dtos/get/song-response.dto";
import { UserResponseDto } from "src/resources/users/dtos/get/user-response.dto";

@Exclude()
export class UserListenResponseDto implements UserListen {
    @ApiProperty()
    @Expose()
    userId: string;
    
    @ApiProperty()
    @Expose()
    songId: string;
    
    @ApiProperty()
    @Expose()
    count: number;
    
    @ApiProperty()
    @Expose()
    updatedAt: Date;

    @ApiProperty({ type: UserResponseDto })
    @Expose()
    @Transform(({ value }) => UserResponseDto.toUserResponseDto(value))
    user: User;

    @ApiProperty({ type: SongResponseDto })
    @Expose()
    @Transform(({ value }) => SongResponseDto.toSongResponseDto(value))
    song: Song;
}
