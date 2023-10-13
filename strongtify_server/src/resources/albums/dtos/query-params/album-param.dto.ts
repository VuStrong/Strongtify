import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsOptional } from "class-validator";
import { QueryParamDto } from "src/common/dtos/query-param.dto";

export class AlbumParamDto extends QueryParamDto {
    @ApiProperty({
        required: false,
        description:
            "Find by artistId, type 'null' to find albums with no artist (Strongtify create)",
    })
    @IsOptional()
    @Expose()
    artistId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @Expose()
    genreId?: string;
}
