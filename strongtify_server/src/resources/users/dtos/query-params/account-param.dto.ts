import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { Expose, Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { SortParamDto } from "src/common/dtos/sort-param.dto";
import { MapperService } from "src/common/utils/mapper.service";

export class AccountParamDto extends SortParamDto {
    @ApiProperty({
        required: false,
        name: "q",
        description: "keyword to search users",
    })
    @IsString()
    @IsOptional()
    @Expose({ name: "q" })
    searchValue?: string;

    @ApiProperty({ required: false })
    @Transform(({ value }) => MapperService.mapBool(value))
    @IsBoolean()
    @IsOptional()
    @Expose()
    locked?: boolean;

    @ApiProperty({ required: false })
    @Transform(({ value }) => MapperService.mapBool(value))
    @IsBoolean()
    @IsOptional()
    @Expose()
    emailConfirmed?: boolean;

    @ApiProperty({
        enum: Role,
        required: false,
    })
    @IsEnum(Role)
    @IsOptional()
    @Expose()
    role?: Role;
}
