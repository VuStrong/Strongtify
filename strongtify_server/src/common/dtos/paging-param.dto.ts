import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class PagingParamDto {
    @ApiProperty({
        required: false,
        description: "Skip number of items.",
    })
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    @Expose()
    skip?: number = 0;

    @ApiProperty({
        required: false,
        description: "Limit amount of items to be returned.",
    })
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    @Expose()
    take?: number = 10;

    // if true, allow count all row in query
    allowCount?: boolean = true;
}
