import { ApiProperty } from "@nestjs/swagger";
import { Playlist, PlaylistStatus } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class CudPlaylistResponseDto implements Playlist {
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

    @ApiProperty()
    @Expose()
    userId: string;

    @ApiProperty()
    @Expose()
    status: PlaylistStatus;
}
