import { ApiProperty } from "@nestjs/swagger";
import { UserListenResponseDto } from "./user-listen-response.dto";
import { Exclude, Expose, plainToInstance, Transform } from "class-transformer";

@Exclude()
export class AdminWebStatDto {
    @ApiProperty()
    @Expose()
    newUserTodayCount: number;

    @ApiProperty()
    @Expose()
    newPlaylistTodayCount: number;

    @ApiProperty({ type: UserListenResponseDto, isArray: true })
    @Expose()
    @Transform(({ value }) => plainToInstance(UserListenResponseDto, value))
    recentListens: UserListenResponseDto[];
}
