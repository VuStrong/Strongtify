import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsInt, IsOptional, Matches } from "class-validator";

/**
 * Class contains fields to perform common Read operation
 * (Paging, Search, Sort)
 */
export class QueryParamDto {
    // Pagination
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

    allowCount?: boolean = true; // if true, allow count all row in query

    // sort
    @ApiProperty({
        required: false,
        description:
            "Sort data by it's field, _desc to sort descending, _asc for ascending",
        example: "name_desc",
    })
    @IsOptional()
    @Matches(/^\w+(_desc|_asc)+$/, {
        message: "'sort' must end with _desc or _asc",
    })
    @Expose()
    sort?: string;

    // search
    @ApiProperty({
        required: false,
        name: "q",
        description: "Keyword to search for items",
    })
    @IsOptional()
    @Expose({ name: "q" })
    keyword?: string;
}
