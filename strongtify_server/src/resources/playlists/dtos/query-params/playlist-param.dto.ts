import { ApiProperty } from "@nestjs/swagger";
import { PlaylistStatus } from "@prisma/client";
import { Expose } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";
import { SortParamDto } from "src/common/dtos/sort-param.dto";

export class PlaylistParamDto extends SortParamDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @Expose()
    userId?: string;

    @ApiProperty({
        enum: PlaylistStatus,
        required: false,
    })
    @IsOptional()
    @IsEnum(PlaylistStatus)
    @Expose()
    status?: PlaylistStatus;

    userRequestId?: string;
}
