import { ApiProperty } from "@nestjs/swagger";
import { PlaylistStatus } from "@prisma/client";
import { Expose } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";
import { QueryParamDto } from "src/common/dtos/query-param.dto";

/** Options for restrict playlist to be returned */
type RestrictOptions = {
    userIdToRestrict?: string;
    restrict?: boolean;
}

export class PlaylistParamDto extends QueryParamDto {
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

    restrictOptions?: RestrictOptions;
}
