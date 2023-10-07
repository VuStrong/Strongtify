import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class PagedResponseDto<T> {
    @ApiProperty({
        isArray: true,
        description: "Items after paged.",
    })
    @Expose()
    results: T[];

    @ApiProperty()
    @Expose()
    total: number;

    @ApiProperty()
    @Expose()
    skip: number;

    @ApiProperty()
    @Expose()
    take: number;

    @ApiProperty()
    @Expose()
    end: boolean;

    constructor(results: T[], skip: number, take: number, total: number) {
        this.results = results;
        this.total = total && total >= 0 ? total : 0;
        this.skip = skip && skip >= 0 ? skip : 0;
        this.take = take && take > 0 ? take : 1;
        this.end = this.take + this.skip >= this.total;
    }
}
