import { ApiProperty } from "@nestjs/swagger";
import { PlaylistStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class UserDetailParamDto {
    @ApiProperty({
        required: false,
        description:
            "Limit followers to be returned, default is no follower return",
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    followerLimit?: number;

    @ApiProperty({
        required: false,
        description:
            "Limit following users to be returned, default is no following user return",
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    followingUserLimit?: number;

    @ApiProperty({
        required: false,
        description:
            "Limit following artists to be returned, default is no artist return",
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    followingArtistLimit?: number;

    @ApiProperty({
        required: false,
        description:
            "Limit playlists to be returned, default is no playlist return",
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    playlistLimit?: number;

    playlistStatus?: PlaylistStatus;
}
