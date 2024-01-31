import { ApiProperty } from "@nestjs/swagger";
import { Language } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import {
    IsArray,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from "class-validator";
import { MapperService } from "src/common/utils/mapper.service";

export class UpdateSongDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ required: false })
    @Type(() => Date)
    @Transform(({ value }) => value)
    @IsOptional()
    @IsDate()
    releasedAt?: Date = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    songUrl?: string = null;

    @ApiProperty({
        required: false,
        enum: Language,
        default: Language.NONE,
    })
    @IsEnum(Language)
    @IsOptional()
    language?: Language = Language.NONE;

    @ApiProperty({ required: false })
    @Transform(({ value }) => MapperService.mapArray(value))
    @IsArray()
    @IsNotEmpty({ each: true })
    @IsString({ each: true })
    @IsOptional()
    artistIds?: string[] = null;

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
