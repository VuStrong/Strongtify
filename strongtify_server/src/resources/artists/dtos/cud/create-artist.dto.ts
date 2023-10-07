import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateArtistDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ required: false })
    @Type(() => Date)
    @Transform(({ value }) => value)
    @IsDate({
        message: "birthDate must match yyyy-mm-dd.",
    })
    @IsOptional()
    birthDate?: Date;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    about?: string;

    @ApiProperty({
        type: "file",
        required: false,
    })
    image: Express.Multer.File;
}
