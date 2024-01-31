import { ApiProperty } from "@nestjs/swagger";
import { Language } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import {
    IsArray,
    IsDate,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
} from "class-validator";
import { MapperService } from "src/common/utils/mapper.service";

export class CreateSongDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ required: false })
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    length?: number = 0;

    @ApiProperty({ required: false })
    @Type(() => Date)
    @Transform(({ value }) => value)
    @IsDate()
    @IsOptional()
    releasedAt?: Date;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    songUrl?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    downloadUrl?: string;

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
    artistIds?: string[];

    @ApiProperty({ required: false })
    @Transform(({ value }) => MapperService.mapArray(value))
    @IsArray()
    @IsNotEmpty({ each: true })
    @IsString({ each: true })
    @IsOptional()
    genreIds?: string[];

    @ApiProperty({
        type: "file",
        required: false,
    })
    image: Express.Multer.File;
}
