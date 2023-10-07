import { ApiProperty } from "@nestjs/swagger";
import { Genre } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class CudGenreResponseDto implements Genre {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    alias: string;

    @ApiProperty()
    @Expose()
    imageUrl: string;

    @ApiProperty()
    @Expose()
    description: string;

    createdAt: Date;
    updatedAt: Date;
    imageId: string;
}
