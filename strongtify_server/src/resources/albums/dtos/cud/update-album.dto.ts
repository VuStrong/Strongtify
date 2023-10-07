import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { MapperService } from "src/common/utils/mapper.service";

export class UpdateAlbumDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    artistId?: string = null;

    @ApiProperty({ required: false })
    @Transform(({ value }) => MapperService.mapArray(value))
    @IsArray()
    @IsNotEmpty({ each: true })
    @IsString({ each: true })
    @IsOptional()
    genreIds?: string[] = null;

    @ApiProperty({
        type: "file",
        required: false,
    })
    image?: Express.Multer.File;
}
