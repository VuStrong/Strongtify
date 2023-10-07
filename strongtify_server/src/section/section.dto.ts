import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class Section<T> {
    @ApiProperty()
    @Expose()
    title: string;

    @ApiProperty()
    @Expose()
    type: string;

    @ApiProperty()
    @Expose()
    link?: string;

    @ApiProperty({ isArray: true })
    @Expose()
    items: T[];
}
