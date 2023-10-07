import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class GenreDetailParamDto {
    @ApiProperty({
        required: false,
        description: "Limit songs to be returned, default is no song return",
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    songLimit?: number;

    @ApiProperty({
        required: false,
        description: "Limit albums to be returned, default is no album return",
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    albumLimit?: number;
}
