import { ApiProperty } from "@nestjs/swagger";
import { PlaylistStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdatePlaylistDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string = null;

    @ApiProperty({ enum: PlaylistStatus })
    @IsEnum(PlaylistStatus)
    status: PlaylistStatus;

    @ApiProperty({
        type: "file",
        required: false,
    })
    image?: Express.Multer.File;
}
