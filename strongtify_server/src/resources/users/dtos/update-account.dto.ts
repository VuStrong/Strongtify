import { ApiProperty } from "@nestjs/swagger";
import { Gender } from "@prisma/client";
import { Expose, Transform, Type } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsString, Length } from "class-validator";

export class UpdateAccountDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @Length(1, 30)
    @IsString()
    @Expose()
    name?: string;

    @ApiProperty({
        enum: Gender,
        required: false,
    })
    @IsOptional()
    @IsEnum(Gender)
    @Expose()
    gender?: Gender;

    @ApiProperty({ required: false })
    @Type(() => Date)
    @Transform(({ value }) => value)
    @IsOptional()
    @IsDate({
        message: "birthDate must match yyyy-mm-dd.",
    })
    @Expose()
    birthDate?: Date;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @Expose()
    about?: string;

    @ApiProperty({
        type: "file",
        required: false,
    })
    image: Express.Multer.File;
}
