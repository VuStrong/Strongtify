import { ApiProperty } from "@nestjs/swagger";
import { Genre } from "@prisma/client";
import { Exclude, Expose, plainToInstance } from "class-transformer";

@Exclude()
export class GenreResponseDto implements Genre {
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

    createdAt: Date;
    updatedAt: Date;
    description: string;
    imageId: string;

    static toGenreResponseDto(genre: Genre | Genre[]): any {
        return plainToInstance(GenreResponseDto, genre, {
            excludeExtraneousValues: true,
        });
    }
}
