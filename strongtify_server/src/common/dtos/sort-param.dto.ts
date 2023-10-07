import { Expose } from "class-transformer";
import { IsOptional, Matches } from "class-validator";
import { PagingParamDto } from "./paging-param.dto";
import { ApiProperty } from "@nestjs/swagger";

export class SortParamDto extends PagingParamDto {
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
}
