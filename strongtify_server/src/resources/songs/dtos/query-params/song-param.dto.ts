import { ApiProperty } from "@nestjs/swagger";
import { Language } from "@prisma/client";
import { Expose } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";
import { QueryParamDto } from "src/common/dtos/query-param.dto";

export class SongParamDto extends QueryParamDto {
    @ApiProperty({ required: false, enum: Language })
    @IsEnum(Language)
    @IsOptional()
    @Expose()
    language?: Language;

    @ApiProperty({ required: false })
    @IsOptional()
    @Expose()
    artistId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @Expose()
    genreId?: string;
}
